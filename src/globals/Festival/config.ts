import type { GlobalConfig } from 'payload'

export const Festival: GlobalConfig = {
  slug: 'festival',
  access: {
    read: () => true,
  },
  label: '開催情報',
  admin: {
    group: 'コンテンツ管理',
  },
  fields: [
    {
      name: 'festivalInfo',
      type: 'group',
      label: '基本情報',
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