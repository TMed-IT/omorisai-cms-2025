import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'ヘッダー',
  access: {
    read: () => true,
  },
  admin: {
    group: 'サイト設定',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'ロゴ画像',
      admin: {
        description: 'ヘッダーに表示されるロゴ画像を選択してください',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
        description: 'ヘッダーナビゲーションに表示する項目を追加してください',
      },
      label: 'ナビゲーション項目',
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: '検索ボタンを表示',
      defaultValue: true,
      admin: {
        description: 'ヘッダーに検索ボタンを表示するかどうかを設定します',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
