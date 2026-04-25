var SKILLS = {
  languages: [
    {
      name: 'PHP',
      star: 3,
      frameworks: ['Laravel', 'CakePHP'],
      achievements: [
        '外部APIとの連携設計・実装（LINE Messaging API、Gmail API）',
        'マルチ認証・ロールベースアクセス制御',
        'Laravelサービスクラスを用いたビジネスロジック分離',
        'ストレージ管理・ファイルアップロード制御',
        'Google Drive APIを用いた画像プロキシ配信・キャッシュ制御'
      ]
    },
    {
      name: 'JavaScript',
      star: 3,
      frameworks: ['jQuery'],
      achievements: [
        '非同期通信によるリアルタイムUI更新',
        'DOM操作・イベント駆動設計',
        'ポーリングを用いたチャット機能実装',
        'Web APIを用いたデータ可視化'
      ]
    },
    {
      name: 'TypeScript',
      star: 1,
      frameworks: ['Node.js'],
      achievements: [
        '型安全なREST API設計・実装',
        '外部サービスとのデータ連携処理',
        'ファイル入出力・バイナリ変換処理'
      ]
    },
    {
      name: 'HTML',
      star: 3,
      frameworks: [],
      achievements: [
        'セマンティックなマークアップ設計',
        'アクセシビリティを考慮した構造設計'
      ]
    },
    {
      name: 'CSS',
      star: 3,
      frameworks: [],
      achievements: [
        'モバイルファーストのレスポンシブデザイン',
        'Flexbox・Gridを用いたレイアウト設計',
        'アニメーション・トランジション実装'
      ]
    },
    {
      name: 'GAS',
      star: 3,
      frameworks: [],
      achievements: [
        'Gmailからのクレジットカードメールをパースしてスプレッドシートへ自動集計',
        'iPhoneショートカット × GAS × LINEで半自動家計簿システムを構築',
        'Googleカレンダーの予定をLINE Messaging APIで毎朝通知',
        'doPostを用いたWebhookエンドポイント実装',
        'LINE公式アカウントとのメッセージ連携自動化'
      ]
    },
    {
      name: 'Java',
      star: 2,
      frameworks: ['Spring Framework'],
      achievements: [
        'Spring MVCを用いたWebアプリケーション設計・実装',
        '官公庁向け調達システムの要件定義〜詳細設計'
      ]
    },
    {
      name: 'C#',
      star: 1,
      frameworks: [],
      achievements: [
        'Webアプリケーション開発・バッチ処理実装',
        'ファイル入出力・データ変換処理'
      ]
    },
    {
      name: 'SQL',
      star: 2,
      frameworks: [],
      achievements: [
        'サブクエリ・複数テーブル結合を用いた複雑なデータ抽出',
        'インデックス設計・クエリ最適化',
        'トランザクション管理'
      ]
    }
  ],
  tools: [
    { category: 'OS',          name: 'Mac OS',          star: 4 },
    { category: 'OS',          name: 'Windows',         star: 3 },
    { category: 'OS',          name: 'Linux',           star: 3 },
    { category: 'DB',          name: 'MySQL',           star: 3 },
    { category: 'DB',          name: 'PostgreSQL',      star: 3 },
    { category: 'Communicate', name: 'Microsoft Teams', star: 3 },
    { category: 'Communicate', name: 'Google Meets',    star: 3 },
    { category: 'Communicate', name: 'Gmail',           star: 4 },
    { category: 'Communicate', name: 'Zoom',            star: 3 },
    { category: 'Communicate', name: 'Slack',           star: 4 },
    { category: 'Editor',      name: 'VSCode',          star: 4 },
    { category: 'Editor',      name: 'PhpStorm',        star: 2 },
    { category: 'Editor',      name: 'Visual Studio',   star: 3 },
    { category: 'Editor',      name: 'Eclipse',         star: 2 },
    { category: 'Other',       name: 'GitHub',          star: 3 },
    { category: 'Other',       name: 'SourceTree',      star: 3 },
    { category: 'Other',       name: 'Figma',           star: 2 },
    { category: 'Other',       name: 'Backlog',         star: 4 },
    { category: 'Other',       name: 'Asana',           star: 2 }
  ]
};
