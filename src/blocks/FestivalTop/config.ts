import type { Block } from 'payload'

export const FestivalTopBlock: Block = {
  slug: 'festivalTop',
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      label: 'バッジテキスト',
      required: false,
    },
    {
      name: 'showCountdown',
      type: 'checkbox',
      label: 'カウントダウンを表示',
      defaultValue: false,
    },
    {
      name: 'showSlogan',
      type: 'checkbox',
      label: 'スローガンを表示',
      defaultValue: false,
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
    {
      name: 'announcementText',
      type: 'text',
      label: 'お知らせメッセージ',
      defaultValue: '開催日時は後日発表予定です',
      required: false,
    },
    {
      name: 'slogan',
      type: 'text',
      label: 'スローガン',
      defaultValue: '創造と革新が交差する、未来への扉を開く文化祭',
      required: false,
    },
    {
      name: 'noticeText',
      type: 'text',
      label: '詳細案内テキスト',
      defaultValue: '詳細が決まり次第、こちらのサイトとSNSでお知らせいたします',
      required: false,
    },
  ],
  interfaceName: 'FestivalTopBlock',
} 