import type { Block } from 'payload'

export const FestivalInfoBlock: Block = {
  slug: 'festivalInfo',
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      label: 'バッジテキスト',
      required: false,
    },
    {
      name: 'showSchedule',
      type: 'checkbox',
      label: '日程を表示',
      defaultValue: false,
    },
    {
      name: 'showLocation',
      type: 'checkbox',
      label: '開催場所を表示',
      defaultValue: false,
    },
    {
      name: 'dateFormat',
      type: 'group',
      label: '日付フォーマット設定',
      admin: {
        description: 'ISO date format が利用できます。YYYY(年), YY(年の下2桁), MM(月2桁), M(月), DD(日2桁), D(日) を使用してください。例: YYYY/MM/DD, MM月DD日, YYYY年M月D日, YY-MM-DD',
      },
      fields: [
        {
          name: 'startDateFormat',
          type: 'text',
          label: '開始日のフォーマット',
          required: true,
        },
        {
          name: 'endDateFormat',
          type: 'text',
          label: '終了日のフォーマット',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'FestivalInfoBlock',
} 