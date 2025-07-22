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

`.env`ファイルを作成し、必要な環境変数を設定してください：

```env
DATABASE_URI=mongodb://localhost:27017/omorisai-cms
PAYLOAD_SECRET=your-secret-key
CRON_SECRET=your-cron-secret
```

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. 開発サーバーの起動

#### 方法1: Docker Compose（推奨）

```bash
# 開発環境
./start.sh

# または直接実行
docker-compose up -d
```

#### 方法2: ローカル環境

```bash
# MongoDBを別途起動する必要があります
pnpm dev
```

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
# シードスクリプトの実行
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
# 開発サーバー起動
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
```

## Docker

### 開発環境

```bash
docker-compose up -d
```

### 本番環境

```bash
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
- CORS設定
- 入力値検証

## レスポンシブ対応

- モバイル（375px）
- タブレット（768px）
- デスクトップ（1440px）

## 🆘 サポート

問題が発生した場合や質問がある場合は、Issueを作成してください。
