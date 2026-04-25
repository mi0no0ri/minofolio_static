# minofolio-static

ポートフォリオサイト（静的HTML版）
GitHub Pages で公開。

## URL

https://minori_no_gallery.github.io/minofolio-static/

## 概要

Laravel で構築していた旧ポートフォリオサイトを、サーバー不要の静的 HTML/CSS/JS に移行したもの。

## 技術スタック

- HTML / CSS / JavaScript（jQuery）
- GitHub Pages（ホスティング）
- Qiita API（Works ページのシステム記事取得）
- note RSS + allorigins.win（Blog ページの記事取得）
- Google Form（お問い合わせフォーム）

## ファイル構成

```
.
├── index.html
├── about.html
├── work.html
├── work-detail-1.html
├── work-detail-2.html
├── contact.html
├── certification.html
├── blog.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   ├── certifications.js  # 資格データ
│   ├── skills.js          # 使用言語・ツールデータ
│   └── blog.js            # note以外の手動ブログ記事データ
└── images/
    ├── myimage.jpg
    ├── background.jpg
    ├── qiita-icon.png
    ├── favicon.ico
    ├── work/              # 作品画像
    └── blog/              # ブログ記事サムネイル
```

## データの更新方法

### 資格を追加する
`data/certifications.js` の配列に追加してください。

```js
{ "category": "IT系", "subcategory": "AWS", "name": "Solutions Architect", "date": "2025-01-01", "passed": true, "color": "blue", "score": null, "grade": null }
```

### スキル・ツールを更新する
`data/skills.js` の `languages` または `tools` 配列を編集してください。

### ブログ記事を追加する（note以外）
`data/blog.js` の `BLOG_POSTS` 配列に追加してください。

```js
{
  title: '記事タイトル',
  link: 'https://...',
  date: '2025-01-01',
  tag: 'news',           // 'news' or 'book'
  description: '概要文',
  thumbnail: 'images/blog/ファイル名.jpg'
}
```

## ローカルでの確認方法

`file://` で直接開くと一部機能（RSS取得など）が動作しません。
ローカルサーバーを立ち上げて確認してください。

```bash
python3 -m http.server 8000
# http://localhost:8000 でアクセス
```
