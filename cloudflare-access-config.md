# Cloudflare Access 設定ガイド

## 概要
このCMSではCloudflare Accessを使ったSSOログインが利用できます。

## 設定手順

### 1. Cloudflare Access設定

1. Cloudflare ダッシュボードにログイン
2. Zero Trust > Access > Applications へ移動
3. "Add an application" をクリック
4. "Self-hosted" を選択
5. アプリケーション設定：
   - Application name: `omorisai-cms` 
   - Application domain: `your-domain.com`
   - Session Duration: `24h` (推奨)

### 2. 環境変数設定

`.env`ファイルに以下を追加：

```bash
# Cloudflare Access設定
CLOUDFLARE_TEAM_DOMAIN=your-team-name
CLOUDFLARE_APPLICATION_AUD=your-application-audience-tag
```

### 3. Audience Tag の取得方法

1. Cloudflare Access アプリケーション設定画面
2. "Overview" タブ
3. "Application Audience (AUD) Tag" をコピー

### 4. Team Domain の取得方法

1. Cloudflare Zero Trust ダッシュボード
2. Settings > Custom pages
3. Team domain: `https://your-team-name.cloudflareaccess.com`
4. `your-team-name` 部分が Team Domain

## 使用方法

1. ログインページで "🔐 Cloudflare Accessでログイン" ボタンが表示される
2. Cloudflare Accessで認証済みの場合、ワンクリックでログイン可能
3. 初回ログイン時は自動的にユーザーアカウントが作成される（権限: editor）

## トラブルシューティング

### ボタンが表示されない
- Cloudflare Accessで認証されていない
- 環境変数が正しく設定されていない

### ログインエラー
- Application AUD Tagが間違っている
- Team Domainが間違っている
- Cloudflare Accessアプリケーションの設定が間違っている

## セキュリティ注意事項

- 初回作成されるユーザーの権限は `editor` です
- 管理者権限が必要な場合は、PayloadCMS管理画面から手動で変更してください
- Cloudflare Accessのアクセスポリシーを適切に設定してください