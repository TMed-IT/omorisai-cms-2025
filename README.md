# Payload ウェブサイトテンプレート

これは公式の [Payload ウェブサイトテンプレート](https://github.com/payloadcms/payload/blob/main/templates/website) です。小規模からエンタープライズまで、ウェブサイト、ブログ、ポートフォリオを構築するために使用できます。このリポジトリには、完全に動作するバックエンド、エンタープライズグレードの管理パネル、美しく設計された本番対応のウェブサイトが含まれています。

このテンプレートは以下の場合に適しています：

- 個人またはエンタープライズグレードのウェブサイト、ブログ、ポートフォリオ
- 完全な機能を備えた公開ワークフローを持つコンテンツ発行プラットフォーム
- Payloadの機能を探索したい場合

主要機能：

- [事前設定されたPayload設定](#how-it-works)
- [認証](#users-authentication)
- [アクセス制御](#access-control)
- [レイアウトビルダー](#layout-builder)
- [ドラフトプレビュー](#draft-preview)
- [ライブプレビュー](#live-preview)
- [オンデマンド再検証](#on-demand-revalidation)
- [SEO](#seo)
- [検索](#search)
- [リダイレクト](#redirects)
- [ジョブとスケジュール公開](#jobs-and-scheduled-publish)
- [ウェブサイト](#website)

## クイックスタート

この例をローカルで起動するには、以下の手順に従ってください：

### クローン

まだ行っていない場合は、このリポジトリのスタンドアロンコピーをマシンに用意する必要があります。すでにこのリポジトリをクローンしている場合は、[開発](#development)にスキップしてください。

#### 方法1（推奨）

Payload Cloudに移動して[このテンプレートをクローン](https://payloadcms.com/new/clone/website)してください。これにより、このテンプレートのコードを含む新しいリポジトリがGitHubアカウントに作成され、その後自分のマシンにクローンできます。

#### 方法2

`create-payload-app` CLIを使用して、このテンプレートを直接マシンにクローンします：

```bash
pnpx create-payload-app my-project -t website
```

#### 方法3

`git` CLIを使用して、このテンプレートを直接マシンにクローンします：

```bash
git clone -n --depth=1 --filter=tree:0 https://github.com/payloadcms/payload my-project && cd my-project && git sparse-checkout set --no-cone templates/website && git checkout && rm -rf .git && git init && git add . && git mv -f templates/website/{.,}* . && git add . && git commit -m "Initial commit"
```

### 開発

1. まだ行っていない場合は、まず[リポジトリをクローン](#clone)してください
1. `cd my-project && cp .env.example .env` でサンプル環境変数をコピー
1. `pnpm install && pnpm dev` で依存関係をインストールし、開発サーバーを起動
1. `http://localhost:3000` を開いてブラウザでアプリを開く

これで完了です！`./src`で行った変更はアプリに反映されます。画面の指示に従ってログインし、最初の管理者ユーザーを作成してください。準備ができたら[本番](#production)をチェックしてアプリのビルドと提供を行い、[デプロイ](#deployment)でライブに移行してください。

## 仕組み

Payload設定は、ほとんどのウェブサイトのニーズに特化して調整されています。以下の方法で事前設定されています：

### コレクション

この機能を拡張する方法の詳細については、[コレクション](https://payloadcms.com/docs/configuration/collections)ドキュメントを参照してください。

- #### ユーザー（認証）

  ユーザーは認証が有効なコレクションで、管理パネルと未公開コンテンツにアクセスできます。詳細については[アクセス制御](#access-control)を参照してください。

  追加のヘルプについては、公式の[認証例](https://github.com/payloadcms/payload/tree/main/examples/auth)または[認証](https://payloadcms.com/docs/authentication/overview#authentication-overview)ドキュメントを参照してください。

- #### 投稿

  投稿は、ブログ投稿、ニュース記事、または時間をかけて公開されるその他のタイプのコンテンツを生成するために使用されます。すべての投稿はレイアウトビルダーが有効になっているため、レイアウト構築ブロックを使用して各投稿のユニークなレイアウトを生成できます。詳細については[レイアウトビルダー](#layout-builder)を参照してください。投稿はドラフト対応でもあるため、ウェブサイトに公開する前にプレビューできます。詳細については[ドラフトプレビュー](#draft-preview)を参照してください。

- #### ページ

  すべてのページはレイアウトビルダーが有効になっているため、レイアウト構築ブロックを使用して各ページのユニークなレイアウトを生成できます。詳細については[レイアウトビルダー](#layout-builder)を参照してください。ページはドラフト対応でもあるため、ウェブサイトに公開する前にプレビューできます。詳細については[ドラフトプレビュー](#draft-preview)を参照してください。

- #### メディア

  これは、ページ、投稿、プロジェクトが画像、動画、ダウンロード、その他のアセットなどのメディアを含むために使用するアップロード対応コレクションです。事前設定されたサイズ、焦点、手動リサイズ機能を備えており、画像の管理を支援します。

- #### カテゴリー

  投稿をグループ化するために使用される分類法。カテゴリーは互いにネストできます。例：「ニュース > テクノロジー」。詳細については、公式の[Payloadネストドキュメントプラグイン](https://payloadcms.com/docs/plugins/nested-docs)を参照してください。

### グローバル

この機能を拡張する方法の詳細については、[グローバル](https://payloadcms.com/docs/configuration/globals)ドキュメントを参照してください。

- `Header`

  フロントエンドのヘッダーに必要なデータ（ナビリンクなど）。

- `Footer`

  上記と同じですが、サイトのフッター用です。

## アクセス制御

基本的なアクセス制御は、公開ステータスに基づいて各種コンテンツへのアクセスを制限するように設定されています。

- `users`: ユーザーは管理パネルにアクセスし、コンテンツを作成または編集できます。
- `posts`: 誰でも公開された投稿にアクセスできますが、作成、更新、削除はユーザーのみです。
- `pages`: 誰でも公開されたページにアクセスできますが、作成、更新、削除はユーザーのみです。

この機能を拡張する方法の詳細については、[Payloadアクセス制御](https://payloadcms.com/docs/access-control/overview#access-control)ドキュメントを参照してください。

## レイアウトビルダー

強力なレイアウトビルダーを使用して、あらゆるタイプのコンテンツのユニークなページレイアウトを作成します。このテンプレートには以下のレイアウト構築ブロックが事前設定されています：

- ヒーロー
- コンテンツ
- メディア
- コールトゥアクション
- アーカイブ

各ブロックは完全に設計され、このテンプレートに付属するフロントエンドウェブサイトに組み込まれています。詳細については[ウェブサイト](#website)を参照してください。

## Lexicalエディター

Payloadブロック、メディア、リンク、その他の機能をすぐに使用できる深い編集体験で、フローを中断することなくコンテンツの作成に集中できる完全な自由を提供します。詳細については[Lexical](https://payloadcms.com/docs/rich-text/overview)ドキュメントを参照してください。

## ドラフトプレビュー

すべての投稿とページはドラフト対応のため、ウェブサイトに公開する前にプレビューできます。これを行うために、これらのコレクションは`drafts`を`true`に設定した[バージョン](https://payloadcms.com/docs/configuration/collections#versions)を使用します。これは、新しい投稿、プロジェクト、またはページを作成すると、ドラフトとして保存され、公開するまでウェブサイトに表示されないことを意味します。また、ウェブサイトに公開する前にドラフトをプレビューできることも意味します。これを行うために、フロントエンドにリダイレクトしてドラフトバージョンのコンテンツを安全に取得するカスタムURLを自動的にフォーマットします。

このテンプレートのフロントエンドは静的生成されるため、ページ、投稿、プロジェクトは公開されたドキュメントに変更が加えられると再生成する必要があります。これを行うために、ドキュメントが変更され、その`_status`が`published`の場合にフロントエンドを再生成する`afterChange`フックを使用します。

この機能を拡張する方法の詳細については、公式の[ドラフトプレビュー例](https://github.com/payloadcms/payload/tree/examples/draft-preview)を参照してください。

## ライブプレビュー

ドラフトプレビューに加えて、ライブプレビューも有効にして、SSRレンダリングの完全なサポートでコンテンツを編集しながら最終的なページを表示できます。詳細については[ライブプレビュードキュメント](https://payloadcms.com/docs/live-preview/overview)を参照してください。

## オンデマンド再検証

コレクションとグローバルにフックを追加して、ページ、投稿、フッター、ヘッダーが変更されると、Nextjsがサポートするオンデマンド再検証によりフロントエンドで自動的に更新されるようにしました。

> 注意：画像が変更された場合（例：クロップされた場合）、Nextjs画像キャッシュを再検証できるようにするには、使用されているページを再公開する必要があります。

## SEO

このテンプレートには、管理パネルからの完全なSEO制御のための公式[Payload SEOプラグイン](https://payloadcms.com/docs/plugins/seo)が事前設定されています。すべてのSEOデータは、このテンプレートに付属するフロントエンドウェブサイトに完全に統合されています。詳細については[ウェブサイト](#website)を参照してください。

## 検索

このテンプレートには、SSR検索機能をNext.jsに簡単に実装する方法を示す公式[Payload検索プラグイン](https://payloadcms.com/docs/plugins/search)も事前設定されています。詳細については[ウェブサイト](#website)を参照してください。

## リダイレクト

既存のサイトを移行している場合や、コンテンツを新しいURLに移動している場合は、`redirects`コレクションを使用して古いURLから新しいURLへの適切なリダイレクトを作成できます。これにより、検索エンジンに適切なリクエストステータスコードが返され、ユーザーが壊れたリンクで残されることがなくなります。このテンプレートには、管理パネルからの完全なリダイレクト制御のための公式[Payloadリダイレクトプラグイン](https://payloadcms.com/docs/plugins/redirects)が事前設定されています。すべてのリダイレクトは、このテンプレートに付属するフロントエンドウェブサイトに完全に統合されています。詳細については[ウェブサイト](#website)を参照してください。

## ジョブとスケジュール公開

[スケジュール公開](https://payloadcms.com/docs/versions/drafts#scheduled-publish)を設定しており、[ジョブキュー](https://payloadcms.com/docs/jobs-queue/jobs)を使用してコンテンツをスケジュールされた時間に公開または非公開にします。タスクはcronスケジュールで実行され、必要に応じて別のインスタンスとしても実行できます。

> 注意：Vercelにデプロイする場合、プラン階層によっては毎日のcronのみに制限される場合があります。

## ウェブサイト

このテンプレートには、[Next.js App Router](https://nextjs.org)で構築された美しく設計された本番対応のフロントエンドが含まれており、Payloadアプリと同じインスタンスで提供されます。これにより、バックエンドとウェブサイトの両方を必要な場所にデプロイできます。

主要機能：

- [Next.js App Router](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [React Hook Form](https://react-hook-form.com)
- [Payload Admin Bar](https://github.com/payloadcms/payload/tree/main/packages/admin-bar)
- [TailwindCSSスタイリング](https://tailwindcss.com/)
- [shadcn/uiコンポーネント](https://ui.shadcn.com/)
- ユーザーアカウントと認証
- 完全機能のブログ
- 公開ワークフロー
- ダークモード
- 事前作成されたレイアウト構築ブロック
- SEO
- 検索
- リダイレクト
- ライブプレビュー

### キャッシュ

Next.jsには堅牢なキャッシュ戦略が標準で含まれていますが、Payload Cloudは[公式Cloudプラグイン](https://www.npmjs.com/package/@payloadcms/payload-cloud)を使用してCloudflareを通じてすべてのファイルをプロキシおよびキャッシュします。これは、Next.jsキャッシュが不要で、デフォルトで無効になっていることを意味します。Payload Cloud以外でアプリをホストしている場合は、`./src/app/_api`のすべてのfetchリクエストから`no-store`ディレクティブを削除し、`./src/app/(pages)/[slug]/page.tsx`などのページファイルから`export const dynamic = 'force-dynamic'`のすべてのインスタンスを削除することで、Next.jsキャッシュメカニズムを簡単に再有効化できます。詳細については、公式の[Next.jsキャッシュドキュメント](https://nextjs.org/docs/app/building-your-application/caching)を参照してください。

## 開発

この例をローカルで起動するには、[クイックスタート](#quick-start)に従ってください。その後、データベースにいくつかのページ、投稿、プロジェクトを[シード](#seed)してください。

### Postgresでの作業

Postgresやその他のSQLベースのデータベースは、データを管理するための厳密なスキーマに従います。MongoDBアダプターと比較すると、これはPostgresでの作業にいくつかの追加手順があることを意味します。

大きなスキーマ変更を行う場合、データを手動で移行しないとデータを失うリスクがあることに注意してください。

#### ローカル開発

理想的には、スキーマ更新を可能な限り高速にするために、データベースのローカルコピーを実行することをお勧めします。デフォルトでは、Postgresアダプターは開発環境で`push: true`になっています。これにより、データ移行を実行する必要なく、フィールドとコレクションを追加、変更、削除できます。

データベースが本番環境を指している場合は、`push: false`に設定する必要があります。そうしないと、データを失うか、移行が同期されていないリスクがあります。

#### 移行

[移行](https://payloadcms.com/docs/database/migrations)は基本的にスキーマを追跡するSQLコードバージョンです。Postgresでデプロイする場合、移行を作成してから実行する必要があります。

ローカルで移行を作成：

```bash
pnpm payload migrate:create
```

これにより、新しい設定と一緒にプッシュする必要がある移行ファイルが作成されます。

サーバー上でビルド後、`pnpm start`を実行する前に移行を実行します：

```bash
pnpm payload migrate
```

このコマンドは、まだ実行されていない移行をチェックし、実行を試み、データベースで実行された移行の記録を保持します。

### Docker

別の方法として、[Docker](https://www.docker.com)を使用してこのテンプレートをローカルで起動できます。これを行うには、以下の手順に従ってください：

1. 上記の[手順1と2](#development)に従ってください。docker-composeファイルは自動的にプロジェクトルートの`.env`ファイルを使用します
1. 次に`docker-compose up`を実行
1. ログインして最初の管理者ユーザーを作成するために、上記の[手順4と5](#development)に従ってください

これで完了です！Dockerインスタンスは、チーム全体で開発環境を標準化しながら、迅速に起動できるよう支援します。

### シード

データベースにいくつかのページ、投稿、プロジェクトをシードするには、管理パネルから「データベースをシード」リンクをクリックできます。

シードスクリプトは、デモンストレーション目的でのみデモユーザーも作成します：

- デモ作成者
  - メール: `demo-author@payloadcms.com`
  - パスワード: `password`

> 注意：データベースのシードは破壊的です。現在のデータベースを削除して、シードテンプレートから新しいデータベースを設定するためです。新しいプロジェクトを開始している場合、または現在のデータを失っても問題ない場合のみ、このコマンドを実行してください。

## 本番

Payloadを本番で実行するには、管理パネルをビルドして起動する必要があります。これを行うには、以下の手順に従ってください：

1. プロジェクトルートで`pnpm build`または`npm run build`を実行して`next build`スクリプトを呼び出します。これにより、本番対応の管理バンドルを含む`.next`ディレクトリが作成されます。
1. 最後に`pnpm start`または`npm run start`を実行して、本番でNodeを実行し、`.build`ディレクトリからPayloadを提供します。
1. ライブに移行する準備ができたら、詳細については下記のデプロイを参照してください。

### Payload Cloudへのデプロイ

プロジェクトをデプロイする最も簡単な方法は、[Payload Cloud](https://payloadcms.com/new/import)を使用することです。これは、GitHubリポジトリから直接Payloadアプリの本番対応インスタンスをデプロイするワンクリックホスティングソリューションです。

### Vercelへのデプロイ

このテンプレートは、無料でVercelにもデプロイできます。テンプレートの設定中にVercel DBアダプターを選択するか、手動でインストールして設定することで開始できます：

```bash
pnpm add @payloadcms/db-vercel-postgres
```

```ts
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  // ...
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  // ...
```

Vercelのblobストレージもサポートしています：

```bash
pnpm add @payloadcms/storage-vercel-blob
```

```ts
// payload.config.ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  // ...
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // ...
```

必要に応じて、Vercelへの[ワンクリックデプロイ](https://github.com/payloadcms/payload/tree/templates/with-vercel-postgres)も簡素化されています。

### セルフホスティング

アプリをデプロイする前に、以下を行う必要があります：

1. アプリが本番でビルドおよび提供されることを確認してください。詳細については[本番](#production)を参照してください。
2. その後、VPS、DigitalOceanのApps Platform、Coolifyなどを介して、他のNode.jsまたはNext.jsアプリケーションと同様にPayloadをデプロイできます。詳細なガイドは近日公開予定です。

アプリを手動でデプロイすることもできます。完全な詳細については[デプロイドキュメント](https://payloadcms.com/docs/production/deployment)をチェックしてください。

## start.sh の使い方

対話的な `start.sh` スクリプトを使って、開発環境または本番環境を起動できます。

1. スクリプトを実行:

   ```sh
   ./start.sh
   ```

2. ↑↓ の矢印キーで以下から選択します：
   - `Development (docker-compose.yml)`：開発環境
   - `Production (docker-compose.prod.yml)`：本番環境
   - `Exit`：終了

3. Enterキーで決定すると、選択した環境が自動的に起動します。

- `tput` コマンドが必要です（macOSやLinuxでは通常インストール済み）。

## 質問

問題や質問がある場合は、[Discord](https://discord.com/invite/payload)でお問い合わせいただくか、[GitHubディスカッション](https://github.com/payloadcms/payload/discussions)を開始してください。
