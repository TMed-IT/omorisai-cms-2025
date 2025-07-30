import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'フッター',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      label: 'ナビゲーション項目',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
