// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { ja } from '@payloadcms/translations/languages/ja'
import { en } from '@payloadcms/translations/languages/en'

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
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
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
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  i18n: {
    supportedLanguages: { ja },
    fallbackLanguage: 'ja',
    translations: {
      ja: {
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
        },
        version:{
          draft: '下書き',
          currentDraft: '現在の下書き',
          lastSavedAgo: '最終保存：{{distance}}前',
          published: '公開',
          publishAllLocales: 'すべてのロケールを公開',
          restoring: '復元中...',
          reverting: '取消中...',
          unpublish: '取り下げ',
          unpublishing: '取り下げ中...',
        },
        fields: {
          chooseFromExisting: 'メディアから選択',
        },
      },
    },
  },
})
