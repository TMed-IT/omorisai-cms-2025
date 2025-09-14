import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

const revalidateFestival: GlobalAfterChangeHook = ({ doc: _doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('global_festival')
  }
}

export const Festival: GlobalConfig = {
  slug: 'festival',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  label: '基本設定',
  admin: {
    group: 'コンテンツ管理',
  },
  hooks: {
    afterChange: [revalidateFestival],
  },
  fields: [
    {
      name: 'festivalInfo',
      type: 'group',
      label: '開催情報',
      fields: [
        {
          name: 'year',
          type: 'text',
          label: '開催年',
          required: true,
        },
        {
          name: 'startDate',
          type: 'date',
          label: '開始日',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          label: '終了日',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
          label: '開催場所',
          required: true,
        },
      ],
    },
    {
      name: 'slogan',
      type: 'group',
      label: 'スローガン設定',
      fields: [
        {
          name: 'english',
          type: 'text',
          label: '英語スローガン',
          required: false,
        },
        {
          name: 'japanese',
          type: 'text',
          label: '日本語スローガン',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          label: '説明文',
          required: false,
        },
      ],
    },
  ],
} 