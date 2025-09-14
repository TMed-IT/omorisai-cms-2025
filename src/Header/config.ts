import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'ヘッダー',
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
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
        description: 'ヘッダーナビゲーションに表示する項目を追加してください',
      },
      label: 'ナビゲーション項目',
    },
  ],
}
