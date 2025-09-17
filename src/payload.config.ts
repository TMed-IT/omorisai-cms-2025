// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Festival } from './globals/Festival/config'
import { Sponsors } from './globals/Sponsors/config'
import { SocialLinks } from './globals/SocialLinks/config'
import { PageMetadata } from './globals/PageMetadata/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import Messages from './collections/Messages'
import Events from './collections/Events'
import Clubs from './collections/Clubs'

import { ja } from '@payloadcms/translations/languages/ja'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
      beforeNavLinks: ['@/components/CustomStyle'],
 
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },

  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [Pages, Posts, Media, Users, Messages, Events, Clubs],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Sponsors, SocialLinks, Festival, PageMetadata],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  i18n: {
    supportedLanguages: { ja } as any,
    translations: {
      ja: {
        authentication: {
          beginCreateFirstUser: 'はじめに、最初のユーザーを作成してください。',
          forgotPassword: 'パスワードを忘れた場合',
          forgotPasswordSuccess: '管理者にお問い合わせください',
          forgotPasswordError: '管理者にお問い合わせください',
          resetPassword: 'パスワードをリセット',
          resetPasswordSuccess: 'パスワードが正常にリセットされました',
          resetPasswordError: 'パスワードのリセットに失敗しました',
          invalidToken: '無効なトークンです',
          tokenExpired: 'トークンの有効期限が切れています',
        },
        operators: {
          contains: '次を含む',
          equals: '次と等しい',
          exists: '次が存在する',
          intersects: '次と重複する',
          isGreaterThan: '次より大きい',
          isGreaterThanOrEqualTo: '次以上',
          isIn: '次に含まれる',
          isLessThan: '次より小さい',
          isLessThanOrEqualTo: '次以下',
          isLike: '次と類似',
          isNotEqualTo: '次と等しくない',
          isNotIn: '次に含まれない',
          isNotLike: '次と類似しない',
          near: '次に近い',
          within: '次の範囲内',
        },
        general: {
          true: '有効',
          false: '無効',
          loading: '読み込み中...',
          locale: '言語',
          locales: '言語',
          updatedAt: '最終更新',
          columns: '列',
          addFilter: 'フィルターを追加',
          filter: 'フィルター',
          filters: 'フィルター',
          filterWhere: '{{label}}をフィルター',
          noFiltersSet: 'フィルターが設定されていません',
          selectValue: '選択...',
          creatingNewLabel: '{{label}} を新規作成中',
          leaveWithoutSaving: '変更は保存されていません',
          changesNotSaved: '未保存の変更があります。このままページを離れると内容が失われます。',
          stayOnThisPage: 'このページに留まる',
          leaveAnyway: '変更を破棄して離れる',
          submitting: '送信中...',
          forgotPasswordDescription: 'パスワードの再設定が必要な場合は、管理者にお問い合わせください。',
          forgotPasswordButtonText: 'ログイン画面へ戻る',
          submit: '管理者にお問い合わせください',
          backToLogin: 'ログイン画面へ戻る',
          editedSince: '編集開始日時',
        },
        version:{
          draft: '下書き',
          currentDraft: '現在の下書き',
          lastSavedAgo: '{{distance}}前に最終保存',
          published: '公開中',

          publishing: '公開しています...',
          publishAllLocales: 'すべてのロケールを公開',
          restoring: '復元中...',
          reverting: '取消中...',
          unpublish: '非公開にする',
          unpublishing: '非公開にしています...',
          confirmUnpublish: '本当に非公開にしますか？',

        },
        validation: {
          emailAddress: '有効なメールアドレスを入力してください',
          enterNumber: '有効な数値を入力してください',
          required: 'この項目は必須です',
          email: '管理者にお問い合わせください',
        },
        fields: {
          chooseFromExisting: 'メディアから選択',
          email: '管理者にお問い合わせください',
        },
        errors: {
          emailOrPasswordIncorrect: 'メールアドレスまたはパスワードが間違っています',
          correctInvalidFields: '無効なフィールドを修正してください',
        },
        forgotPassword: {
          title: 'パスワードを忘れた場合',
          description: 'パスワードの再設定が必要な場合は、管理者にお問い合わせください。',
          buttonText: 'ログイン画面へ戻る',
          emailLabel: '管理者にお問い合わせください',
        },
      },
    },
  },
})
