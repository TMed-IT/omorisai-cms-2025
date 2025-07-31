# 大森祭ウェブサイトCMS

大森祭の公式ウェブサイトを管理するためのコンテンツ管理システム（CMS）です。Payload CMSとNext.jsを使用して構築されており、イベント情報、クラブ情報、お知らせ、メッセージなどのコンテンツを効率的に管理できます。

## 🚀 機能

- **コンテンツ管理**: ページ、お知らせ、イベント、クラブ情報の管理
- **メディア管理**: 画像・動画ファイルのアップロードと管理
- **フォーム機能**: お問い合わせフォームの構築と管理
- **SEO対応**: メタデータ、OGP、サイトマップの自動生成
- **多言語対応**: 日本語対応
- **ライブプレビュー**: リアルタイムでのコンテンツ確認
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.3.0
- **CMS**: Payload CMS 3.43.0
- **データベース**: MongoDB
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI**: Radix UI
- **アニメーション**: Framer Motion
- **パッケージマネージャー**: pnpm

## 📋 前提条件

- Node.js 18.20.2以上または20.9.0以上
- pnpm 9以上または10以上
- Docker & Docker Compose（推奨）

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd oomorisai-cms
```

### 2. 環境変数の設定

プロジェクトには`.env.example`ファイルが含まれており、必要な環境変数のテンプレートが提供されています。

#### 自動設定（推奨）

```bash
# シークレットを自動生成して.envファイルを作成
./generate-secrets.sh
```

このスクリプトは以下のシークレットを自動生成します：
- `PAYLOAD_SECRET`: JWTトークン暗号化用
- `CRON_SECRET`: Cronジョブ認証用
- `PREVIEW_SECRET`: プレビューリクエスト検証用

#### 手動設定

`.env`ファイルを手動で作成する場合：

```env
# MongoDB接続URI（docker composeのmongoサービスを利用）
DATABASE_URI=mongodb://mongo:27017/

# JWTトークン暗号化用シークレット
PAYLOAD_SECRET=your-secret-key

# サーバーのURL（本番は自動で上書きされる場合あり、ローカルは http://localhost:3000 でOK）
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# 開発環境用URL設定（start.shで自動設定）
DEV_SERVER_URL=http://localhost:3000

# 本番環境用URL設定（start.shで自動設定）
PROD_SERVER_URL=https://yourdomain.com

# Cronジョブ認証用シークレット
CRON_SECRET=your-cron-secret

# プレビューリクエスト検証用シークレット
PREVIEW_SECRET=your-secret-here

# Cloudflareトンネル用トークン（必要な場合のみ）
CLOUDFLARE_TUNNEL_TOKEN=your-token-here

# メール設定（パスワードリセット用）
FROM_EMAIL=noreply@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. 開発サーバーの起動

#### Docker Compose

```bash
./start.sh
```

`start.sh`スクリプトは以下の処理を行います：
- `.env`ファイルが存在しない場合、`generate-secrets.sh`を自動実行
- 環境選択メニューを表示（Development/Production/No Cache Build）
- 選択した環境に応じて`.env`ファイルの`NEXT_PUBLIC_SERVER_URL`を自動設定
- 選択した環境でDocker Composeを起動

**環境別URL設定**:
- **開発環境**: `DEV_SERVER_URL`の値を使用（デフォルト: `http://localhost:3000`）
- **本番環境**: `PROD_SERVER_URL`の値を使用（必須設定）

## 📖 使用方法

### 管理画面へのアクセス

開発環境では以下のURLでアクセスできます：
- **管理画面**: http://localhost:3000/admin
- **フロントエンド**: http://localhost:3000

### 初期設定

1. 管理画面にアクセス
2. 最初の管理者ユーザーを作成
3. コンテンツの追加・編集を開始

### データの初期化

サンプルデータを投入する場合：

```bash
curl http://localhost:3000/api/seed
```

## プロジェクト構造

```
src/
├── app/                    # Next.js アプリケーション
│   ├── (frontend)/        # フロントエンドページ
│   └── (payload)/         # Payload CMS管理画面
├── collections/           # コレクション定義
├── blocks/               # ブロックコンポーネント
├── components/           # 再利用可能なコンポーネント
├── globals/             # グローバル設定
│   ├── Header/          # ヘッダー設定
│   ├── Footer/          # フッター設定
│   └── Festival/        # 文化祭情報設定
└── utilities/           # ユーティリティ関数
```

## 開発コマンド

```bash
# 開発サーバー起動（Docker）
./start.sh

# 開発サーバー起動（ローカル）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# 型定義の生成
pnpm generate:types

# リンター実行
pnpm lint

# リンター修正
pnpm lint:fix

# シークレット生成
./generate-secrets.sh
```

## Docker

### 開発環境

```bash
./start.sh

# or
docker-compose up -d
```

### 本番環境

```bash
./start.sh

# or
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📝 コレクション

### Pages（ページ）
- 静的ページの管理
- ブロックベースのコンテンツ編集
- SEO設定

### Posts（お知らせ）
- お知らせ・ニュース記事の管理
- カテゴリ分類
- 公開日時設定

### Events（イベント）
- 祭り関連イベントの管理
- 日時・場所情報
- 参加者募集機能

### Clubs（クラブ）
- 参加クラブ・団体の情報管理
- 活動内容・実績

### Messages（メッセージ）
- お問い合わせメッセージの管理
- フォーム送信データの保存

### Media（メディア）
- 画像・動画ファイルの管理
- 自動リサイズ・最適化

## セキュリティ

- 認証機能付き管理画面
- 環境変数による機密情報管理
- 自動シークレット生成機能
- CORS設定
- 入力値検証
- パスワードリセット機能


## レスポンシブ対応

- モバイル（375px）
- タブレット（768px）
- デスクトップ（1440px）

## 🆘 サポート

問題が発生した場合や質問がある場合は、Issueを作成してください。
