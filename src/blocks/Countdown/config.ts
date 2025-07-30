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
      required: false,
    },
    {
      name: 'noticeText',
      type: 'text',
      label: '詳細案内テキスト',
      required: false,
    },
  ],
  interfaceName: 'CountdownBlock',
} 