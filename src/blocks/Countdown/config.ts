import type { Block } from 'payload'

export const CountdownBlock: Block = {
  slug: 'countdown',
  fields: [
    {
      name: 'showCountdown',
      type: 'checkbox',
      label: 'カウントダウンを表示',
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
      name: 'noticeText',
      type: 'text',
      label: '詳細案内テキスト',
      defaultValue: '詳細が決まり次第、こちらのサイトとSNSでお知らせいたします',
      required: false,
    },
  ],
  interfaceName: 'CountdownBlock',
} 