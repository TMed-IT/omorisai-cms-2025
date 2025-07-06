import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

const revalidateFestival: GlobalAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('global_festival')
  }
}

export const Festival: GlobalConfig = {
  slug: 'festival',
  access: {
    read: () => true,
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
      name: 'socialLinks',
      type: 'array',
      label: 'SNSリンク',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'ラベル',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'アイコン画像',
          required: false,
        },
      ],
    },
  ],
} 