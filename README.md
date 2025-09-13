# 大森祭ウェブサイトCMS

大森祭の公式ウェブサイトを管理するためのコンテンツ管理システム（CMS）です。Payload CMSとNext.jsを使用して構築されており、イベント情報、部活情報、お知らせ、メッセージなどのコンテンツを効率的に管理できます。

## 機能

- **コンテンツ管理**: ページ、お知らせ、イベント情報の管理
- **メディア管理**: 画像・動画ファイルのアップロードと管理
- **フォーム機能**: お問い合わせフォームの構築と管理
- **SEO対応**: メタデータ、OGP、サイトマップの自動生成
- **多言語対応**: 日本語対応
- **ライブプレビュー**: リアルタイムでのコンテンツ確認
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応

## 技術スタック

- **フレームワーク**: Next.js
- **CMS**: Payload CMS
- **データベース**: MongoDB
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI**: Radix UI
- **アニメーション**: Framer Motion
- **パッケージマネージャー**: pnpm

## 前提条件

- Node.js 18.20.2以上または20.9.0以上
- pnpm 9以上または10以上
- Docker & Docker Compose（推奨）

## セットアップ

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

## 使用方法

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

#### CLIツールを使用

```bash
# 全データを初期化（ローカル環境）
pnpm @seed/

# Docker環境（既存のpayloadコンテナ内で実行）
docker-compose exec payload pnpm @seed/
```

#### 特定のコレクションのみを初期化

特定のコレクションのみをseedしたい場合：

```bash
# 特定のコレクションをseed
pnpm seed:collection posts
pnpm seed:collection events
pnpm seed:collection clubs
pnpm seed:collection messages
pnpm seed:collection pages
pnpm seed:collection media

# グローバル設定をseed
pnpm seed:collection header
pnpm seed:collection footer
pnpm seed:collection festival

# Docker環境（既存のpayloadコンテナ内で実行）
docker-compose exec payload pnpm seed:collection posts
```

**注意**: `events`や`clubs`をseedする際は、必要な`media`も自動的にseedされます。

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

# データベース初期化（全データ）
pnpm @seed/

# 特定のコレクションのみ初期化
pnpm seed:collection posts

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

## 静的サイトデプロイ機能（Cloudflare）

このプロジェクトには、admin以外の全てのルートを静的サイトとして書き出し、Cloudflare Pages にデプロイする機能が含まれています。

### 機能概要

- 管理画面: `/admin/deploy` でデプロイ管理UIにアクセス
- Dockerビルド: 別のDockerコンテナで静的サイトをビルド
- Cloudflareデプロイ: ビルドされたファイルをCloudflareへ自動デプロイ
- リアルタイム監視: デプロイ進行状況の確認

### セットアップ（環境変数）

`.env` に以下を設定してください。

```bash
# Cloudflare設定
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_PROJECT_ID=your_project_id_here

# デプロイ設定
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

Cloudflare APIトークン権限（最低限・Account単位）:

- Cloudflare Pages: Read
- Cloudflare Pages: Edit

補足:

- ゾーン単位の権限は不要
- Workers / R2 / KV 等の権限は本構成では不要
- アカウントID/プロジェクトIDはCloudflareダッシュボードで確認

### 依存関係のインストール

```bash
pnpm install
```

### Dockerの設定（ビルド用コンテナ）

ビルド用のDockerイメージ（`build-service`）は `docker-compose*.yml` で起動され、常駐します。

```bash
docker build -f Dockerfile.build -t omorisai-build .
```

### 使用方法

管理画面でのデプロイ:

1. `/admin` にログイン
2. `/admin/deploy` にアクセス
3. 「デプロイ開始」ボタンをクリック
4. 進行状況をリアルタイムで確認

コマンドラインでのビルド:

```bash
bash scripts/build-static.sh [deploy-id]
```

### 関連ファイル構成

```
├── src/app/(payload)/admin/deploy/
│   └── page.tsx                    # デプロイ管理UI
├── src/app/api/deploy/
│   ├── route.ts                    # デプロイ開始API
│   ├── status/[deployId]/route.ts  # デプロイ状況確認API
│   └── history/route.ts            # デプロイ履歴API
├── Dockerfile.build                # ビルド用Dockerfile
├── docker-compose.yml              # Docker Compose設定（dev）
├── docker-compose.prod.yml         # Docker Compose設定（prod）
└── scripts/build-static.sh         # ビルドスクリプト
```

### API エンドポイント

POST `/api/deploy`（デプロイ開始）

```json
{
  "deployId": "uuid",
  "message": "デプロイプロセスを開始しました"
}
```

GET `/api/deploy/status/[deployId]`（状況取得）

```json
{
  "id": "uuid",
  "status": "building|deploying|success|error",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "duration": 120,
  "buildUrl": "https://example.com",
  "error": "エラーメッセージ（エラー時のみ）"
}
```

GET `/api/deploy/history`（履歴一覧）

### デプロイプロセス概要

1. ビルド開始: `build-service` コンテナで静的サイトをビルド
2. ファイル生成: `out/` ディレクトリへ出力
3. Cloudflareデプロイ: 生成ファイルをCloudflareにアップロード
4. 完了通知: デプロイURLを返却

### トラブルシューティング

ビルドエラー:
- Dockerのインストール・起動を確認
- `.env` の設定を確認
- ビルドログを確認

Cloudflareデプロイエラー:
- APIトークンが有効か確認
- アカウントID/プロジェクトIDが正しいか確認
- レート制限などの状態を確認

権限エラー:
- 管理者権限（admin/editor）でログインしているか確認

## API

### ユーザー管理 API

#### POST /api/users/upsert

ユーザーの作成または更新を行います。emailが既存の場合は更新、存在しない場合は新規作成します。

**認証**
- リクエストヘッダーに `Authorization: Bearer {USERS_API_SECRET}` を設定
- 環境変数 `USERS_API_SECRET` を設定する必要があります

**リクエスト**
```json
{
  "email": "m20000a@st.toho-u.ac.jp",
  "name": "東邦 太郎",
  "nameRoman": "Toho Taro",
  "role": "editor"
}
```

**レスポンス（新規作成時）**
```json
{
  "created": true,
  "password": "Abc12345"
}
```

**レスポンス（更新時）**
```json
{
  "updated": true
}
```

**バリデーション**
- email: `st.toho-u.ac.jp` ドメインの有効なメールアドレス
- name: 姓名の間は半角スペースで区切る
- nameRoman: 姓名（ローマ字）の間は半角スペースで区切る
- role: `admin` または `editor`

**エラーレスポンス**
```json
{
  "error": "認証エラー"
}
```

**使用例**
```bash
curl -X POST http://localhost:3000/api/users/upsert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USERS_API_SECRET" \
  -d '{
    "email": "m20000a@st.toho-u.ac.jp",
    "name": "東邦 太郎",
    "nameRoman": "Toho Taro",
    "role": "editor"
  }'
```

## 完全静的出力でメディアを同梱する

静的エクスポート（例: Cloudflare Pages）では `/api/...` が存在しないため、メディアを完全静的に同梱できます。

静的エクスポート + メディア同梱

```bash
pnpm export:full-static
```

内部で行うこと:
- `out/` 配下の HTML/JS/JSON を走査し、`?v=...` を除去
- `out/` に参照される `/media/*` を収集し、`public/media` からコピー（ミラー）

メモ:
- 既に `public/media` に置いてあるファイルはコピーされます
- すべてのメディアは `public/media` に置いてください（アップロードは同ディレクトリに保存される設定です）
- 単体実行: `pnpm export:static` の後に `pnpm postexport:media`
