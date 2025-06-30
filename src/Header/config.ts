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
      },
      label: 'ナビゲーション項目',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
