'use strict';

$(function () {

  // ============================================================
  // note RSS 取得（Blogページ）
  // ============================================================
  const NOTE_USER_ID   = 'brainy_ixia210';
  const NOTE_RSS_URL   = 'https://note.com/' + NOTE_USER_ID + '/rss';
  const ALLORIGINS_URL = 'https://api.allorigins.win/get?url=' + encodeURIComponent(NOTE_RSS_URL);
  const BLOG_PER_PAGE  = 10;

  let allBlogPosts = [];
  let blogPage     = 1;
  let currentTag   = 'all';

  function parseRSS(xmlStr) {
    const parser = new DOMParser();
    const xml    = parser.parseFromString(xmlStr, 'text/xml');
    return Array.from(xml.querySelectorAll('item')).map(item => ({
      title      : item.querySelector('title')?.textContent || '',
      link       : item.querySelector('link')?.textContent || '',
      pubDate    : item.querySelector('pubDate')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      thumbnail  : item.querySelector('thumbnail')?.getAttribute('url') || '',
      tag        : 'note'
    }));
  }

  function renderBlogPage(page, tag) {
    const $list    = $('#blog_list');
    const filtered = tag === 'all' ? allBlogPosts : allBlogPosts.filter(p => p.tag === tag);
    const total    = Math.ceil(filtered.length / BLOG_PER_PAGE);
    const posts    = filtered.slice((page - 1) * BLOG_PER_PAGE, page * BLOG_PER_PAGE);

    if (posts.length === 0) {
      $list.html('<p class="qiita_loading">記事がありません。</p>');
      return;
    }

    const tagLabels = { note: 'note', news: 'ニュース', book: 'おすすめ本' };

    let html = '';
    posts.forEach(post => {
      const date = new Date(post.pubDate || post.date).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const desc      = (post.description || '').replace(/<[^>]+>/g, '').slice(0, 80) + '…';
      const thumbHtml = post.thumbnail
        ? `<img src="${post.thumbnail}" alt="${post.title}" class="blog_card_img">`
        : '';
      const tagLabel  = tagLabels[post.tag] || post.tag;

      html += `
        <a class="blog_card" href="${post.link}" target="_blank" rel="noopener">
          ${thumbHtml}
          <div class="blog_card_body">
            <div class="blog_card_meta">
              <span class="blog_card_date">${date}</span>
              <span class="blog_tag_badge blog_tag_${post.tag}">${tagLabel}</span>
            </div>
            <div class="blog_card_title">${post.title}</div>
            <div class="blog_card_desc">${desc}</div>
          </div>
        </a>`;
    });

    if (total > 1) {
      let pagerHtml = '<div class="qiita_pager">';
      pagerHtml += `<button class="qiita_pager_btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>&lsaquo; 前へ</button>`;
      for (let i = 1; i <= total; i++) {
        pagerHtml += `<button class="qiita_pager_btn ${i === page ? 'is_active' : ''}" data-page="${i}">${i}</button>`;
      }
      pagerHtml += `<button class="qiita_pager_btn" data-page="${page + 1}" ${page === total ? 'disabled' : ''}>次へ &rsaquo;</button>`;
      pagerHtml += '</div>';
      html += pagerHtml;
    }

    $list.html(html);

    $('.qiita_pager_btn').on('click', function () {
      blogPage = parseInt($(this).data('page'));
      renderBlogPage(blogPage, currentTag);
      $('html, body').animate({ scrollTop: $('#blog_list').offset().top - 80 }, 300);
    });
  }

  // タグフィルター
  $('.blog_filter').on('click', function () {
    $('.blog_filter').removeClass('is_active');
    $(this).addClass('is_active');
    currentTag = $(this).data('tag');
    blogPage   = 1;
    if (allBlogPosts.length > 0) {
      renderBlogPage(blogPage, currentTag);
    }
    // allBlogPostsがまだ空（RSS読み込み中）の場合は
    // RSS取得完了後に自動でrenderBlogPageが呼ばれる
  });

  if ($('#blog_list').length) {
    const manualPosts = (typeof BLOG_POSTS !== 'undefined' ? BLOG_POSTS : []).map(p => ({
      ...p, pubDate: p.date
    }));

    // 手動記事がある場合は先に表示
    if (manualPosts.length > 0) {
      allBlogPosts = [...manualPosts];
      renderBlogPage(1, currentTag);
    }

    fetch(ALLORIGINS_URL)
      .then(res => res.json())
      .then(data => {
        const notePosts = parseRSS(data.contents);
        allBlogPosts = [...notePosts, ...manualPosts]
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        renderBlogPage(blogPage, currentTag);
      })
      .catch(() => {
        // RSS取得失敗でも手動記事は表示する
        allBlogPosts = manualPosts;
        if (allBlogPosts.length > 0) {
          renderBlogPage(blogPage, currentTag);
        } else {
          $('#blog_list').html('<p class="qiita_loading">記事の読み込みに失敗しました。</p>');
        }
      });
  }

  // ============================================================
  // 資格データ取得（about・certificationページ共通）
  // ============================================================
  function buildStampHtml(cert, isCircle) {
    const shape = isCircle ? 'stamp_wrap_circle' : '';

    // 未取得はグレーアウトのみ
    if (!cert.passed) {
      return `
        <li class="stamp_wrap ${shape} stamp_gray">
          <p class="certification_name">${cert.name}</p>
        </li>`;
    }

    // 取得済み
    const date     = (cert.date || '').replace(/-/g, '.').slice(0, 10);
    const nameHtml = cert.score ? `${cert.name}<br>${cert.score}点`
                   : cert.grade ? `${cert.name}<br>${cert.grade}級`
                   :              cert.name;
    const result   = cert.score ? '取得' : '合格';

    return `
      <li class="stamp_wrap ${shape} stamp_${cert.color}">
        <p class="certification_date">${date}</p>
        <p class="certification_name">${nameHtml}</p>
        ${result}
      </li>`;
  }

  // aboutページ：取得済みを日付降順で最新4件表示
  if ($('#about_cert_list').length) {
    const passed = CERTIFICATIONS
      .filter(c => c.passed)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
    const html = passed.map(c => buildStampHtml(c, true)).join('');
    $('#about_cert_list').html(html);
  }

  // certificationページ：カテゴリ別に全件表示
  if ($('#cert_list').length) {
    const certs = CERTIFICATIONS;
    const categories = [...new Set(certs.map(c => c.category))];
    let html = '';
    categories.forEach(cat => {
      html += `<h3 class="sub_title">${cat}</h3>`;
      html += `<div class="certification_detail_wrap">`;
      const catCerts = certs.filter(c => c.category === cat);
      const subcats  = [...new Set(catCerts.map(c => c.subcategory).filter(Boolean))];

      if (subcats.length > 0) {
        html += `<div class="certification_detail_contents">`;
        subcats.forEach(sub => {
          html += `<h4 class="small_sub_title">${sub}</h4>`;
          html += `<div class="certification_detail_stamp">`;
          catCerts.filter(c => c.subcategory === sub)
            .forEach(c => { html += buildStampHtml(c, true); });
          html += `</div>`;
        });
        html += `</div>`;
      } else {
        html += `<div class="certification_detail_stamp">`;
        catCerts.forEach(c => { html += buildStampHtml(c, true); });
        html += `</div>`;
      }
      html += `</div>`;
    });
    $('#cert_list').html(html);
  }
  $('.works_tab').on('click', function () {
    const tab = $(this).data('tab');
    $('.works_tab').removeClass('is_active');
    $(this).addClass('is_active');
    $('.works_panel').hide();
    $('#tab_' + tab).show();
  });

  // ============================================================
  // Qiita 記事取得（システムタブ・ページネーション）
  // ============================================================

  // ★ ここをご自身のQiitaユーザーIDに変更してください
  const QIITA_USER_ID = 'minori_no_gallery';
  const QIITA_PER_PAGE = 10;
  const QIITA_API_URL  = 'https://qiita.com/api/v2/users/' + QIITA_USER_ID + '/items?per_page=100';

  let qiitaLoaded  = false;
  let allArticles  = [];
  let currentPage  = 1;

  function renderQiitaPage(page) {
    const $list = $('#qiita_list');
    const start = (page - 1) * QIITA_PER_PAGE;
    const end   = start + QIITA_PER_PAGE;
    const pageArticles = allArticles.slice(start, end);
    const totalPages = Math.ceil(allArticles.length / QIITA_PER_PAGE);

    // カード描画
    let html = '';
    pageArticles.forEach(article => {
      const date = new Date(article.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const tags = article.tags
        .map(t => `<span class="qiita_card_tag">${t.name}</span>`)
        .join('');
      html += `
        <a class="qiita_card" href="${article.url}" target="_blank" rel="noopener">
          <div class="qiita_card_title">${article.title}</div>
          <div class="qiita_card_tags">${tags}</div>
          <div class="qiita_card_date">${date}</div>
        </a>
      `;
    });

    // ページネーション描画
    let pagerHtml = '<div class="qiita_pager">';
    pagerHtml += `<button class="qiita_pager_btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>&lsaquo; 前へ</button>`;
    for (let i = 1; i <= totalPages; i++) {
      pagerHtml += `<button class="qiita_pager_btn ${i === page ? 'is_active' : ''}" data-page="${i}">${i}</button>`;
    }
    pagerHtml += `<button class="qiita_pager_btn" data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''}>次へ &rsaquo;</button>`;
    pagerHtml += '</div>';

    $list.html(html + pagerHtml);

    // ページボタンのクリック
    $('.qiita_pager_btn').on('click', function () {
      currentPage = parseInt($(this).data('page'));
      renderQiitaPage(currentPage);
      // システムタブ上部にスクロール
      $('html, body').animate({ scrollTop: $('#tab_system').offset().top - 80 }, 300);
    });
  }

  function loadQiitaArticles() {
    if (qiitaLoaded) return;
    qiitaLoaded = true;

    fetch(QIITA_API_URL)
      .then(res => res.json())
      .then(articles => {
        if (articles.length === 0) {
          $('#qiita_list').html('<p class="qiita_loading">記事が見つかりませんでした。</p>');
          return;
        }
        allArticles = articles;
        renderQiitaPage(1);
      })
      .catch(() => {
        $('#qiita_list').html('<p class="qiita_loading">記事の読み込みに失敗しました。</p>');
      });
  }

  // システムタブを初めて開いたときだけ取得
  $('[data-tab="system"]').on('click', function () {
    loadQiitaArticles();
  });
  $('.hamburger').on('click', function () {
    $(this).toggleClass('active');
    const isOpen = $(this).hasClass('active');
    $('.navi').toggleClass('active', isOpen);
    $('.hamburgerBackGround').toggleClass('active', isOpen);
    $('html').toggleClass('scrollStop', isOpen);
  });

  // メニューのリンクをクリックしたら閉じる
  $('.menuBar li a').on('click', function () {
    $('.hamburger').removeClass('active');
    $('.navi').removeClass('active');
    $('.hamburgerBackGround').removeClass('active');
    $('html').removeClass('scrollStop');
  });

  // ============================================================
  // ページトップへスクロール
  // ============================================================
  $('.toUpLink').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 1000, 'swing');
  });

  // ============================================================
  // 使用言語モーダル
  // ============================================================
  $('.modal_open').on('click', function () {
    const target = $(this).data('target');
    const $modal = $('#' + target);
    $('.language_modal_wrap').fadeIn();
    $modal.fadeIn();
  });

  $('.modal_close').on('click', function () {
    $('.language_modal_wrap').fadeOut();
    $('.language_modal').fadeOut();
  });

  // スタンプにホバーで拡大
  $('.modal_open').hover(
    function () { $(this).addClass('larger'); },
    function () { $(this).removeClass('larger'); }
  );

  // ============================================================
  // スキル・ツール動的生成（skills.jsから）
  // ============================================================
  function buildStarHtml(star) {
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += i < star
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }

  function buildSkillAccordionHtml(name, star, frameworks, achievements) {
    const frameworksHtml = frameworks && frameworks.length
      ? `<div class="skill_frameworks">${frameworks.map(f => `<small class="languageList">${f}</small>`).join('')}</div>`
      : '';
    const achievementsHtml = achievements && achievements.length
      ? achievements.map(a => `<li>・${a}</li>`).join('')
      : '';
    return `
      <li class="skill_accordion">
        <div class="skill_header">
          <div class="skill_header_left">
            <span class="skill_name">${name}</span>
            <div class="skill_star">${buildStarHtml(star)}</div>
          </div>
          <i class="fa-solid fa-chevron-down carrier_arrow"></i>
        </div>
        <div class="skill_details">
          ${frameworksHtml}
          <ul>${achievementsHtml}</ul>
        </div>
      </li>`;
  }

  // 使用言語を描画
  if ($('#skill_language_list').length && typeof SKILLS !== 'undefined') {
    const html = SKILLS.languages
      .map(l => buildSkillAccordionHtml(l.name, l.star, l.frameworks, l.achievements))
      .join('');
    $('#skill_language_list').html(html);
  }

  // 使用ツールをカテゴリ別に描画（アコーディオンなし）
  if ($('#skill_tool_list').length && typeof SKILLS !== 'undefined') {
    const categories = [...new Set(SKILLS.tools.map(t => t.category))];
    let html = '';
    categories.forEach(cat => {
      html += `<li class="skill_tool_category"><h4 class="small_sub_title">${cat}</h4></li>`;
      SKILLS.tools.filter(t => t.category === cat).forEach(t => {
        html += `
          <li class="skill_tool_item">
            <span class="skill_name">${t.name}</span>
            <div class="skill_star">${buildStarHtml(t.star)}</div>
          </li>`;
      });
    });
    $('#skill_tool_list').html(html);
  }

  // ============================================================
  // スキルアコーディオン（使用言語）
  // ============================================================
  $('.skill_header').on('click', function () {
    const $item = $(this).closest('.skill_accordion');
    const $details = $item.find('.skill_details');
    const isOpen = $item.hasClass('is_open');

    $('.skill_accordion.is_open').not($item).each(function () {
      $(this).removeClass('is_open').find('.skill_details').slideUp(300);
    });

    $item.toggleClass('is_open', !isOpen);
    $details.slideToggle(300);
  });

  // ============================================================
  // 経歴アコーディオン（クリックで開閉）
  // ============================================================
  $('.carrier_header').on('click', function () {
    const $item = $(this).closest('.carrier_accordion');
    const $details = $item.find('.carrier_details_wrap');
    const isOpen = $item.hasClass('is_open');

    // 他を閉じる
    $('.carrier_accordion.is_open').not($item).each(function () {
      $(this).removeClass('is_open').find('.carrier_details_wrap').slideUp(300);
    });

    // クリックしたものをトグル
    $item.toggleClass('is_open', !isOpen);
    $details.slideToggle(300);
  });

});

// ============================================================
// スクロールでフェードイン（index.htmlのみ）
// ============================================================
const isTopPage = location.pathname === '/' || location.pathname.endsWith('index.html') || location.pathname === '';

if (isTopPage) {
  $(window).on('scroll load', function () {
    const scroll = $(this).scrollTop();
    const windowHeight = $(window).height();
    $('.fadeIn, .fadeInRight, .fadeInLeft').each(function () {
      const cntPos = $(this).offset().top;
      if (scroll > cntPos - windowHeight + windowHeight / 3) {
        $(this).addClass('active');
      }
    });
  });

  // Works一覧：カードを順番にスライドイン
  $(function () {
    const EFFECT_BTM  = 400;
    const EFFECT_MOVE = 200;
    const EFFECT_TIME = 2000;

    $('.worksList').children().css({
      opacity: 0,
      transform: 'translateY(' + EFFECT_MOVE + 'px)',
      transition: EFFECT_TIME + 'ms'
    });

    $(window).on('scroll load', function () {
      const scrollBtm = $(this).scrollTop() + $(this).height();
      const effectPos = scrollBtm - EFFECT_BTM;

      $('.worksList').each(function () {
        if (effectPos > $(this).offset().top) {
          $(this).children().each(function (i) {
            $(this).delay(300 + i * 200).queue(function () {
              $(this).css({ opacity: 1, transform: 'translateY(0)' }).dequeue();
            });
          });
        }
      });
    });
  });

} else {
  // トップ以外は即表示
  $('.fadeIn, .fadeInRight, .fadeInLeft').addClass('active');
}
