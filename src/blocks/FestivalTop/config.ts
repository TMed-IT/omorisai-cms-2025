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