import type { Block } from 'payload'

export const SloganBlock: Block = {
  slug: 'slogan',
  fields: [
    {
      name: 'showEnglish',
      type: 'checkbox',
      label: '英語スローガンを表示',
      defaultValue: true,
    },
    {
      name: 'showJapanese',
      type: 'checkbox',
      label: '日本語スローガンを表示',
      defaultValue: true,
    },
    {
      name: 'showDescription',
      type: 'checkbox',
      label: '説明文を表示',
      defaultValue: true,
    },
    {
      name: 'animationType',
      type: 'select',
      label: 'アニメーションタイプ',
      defaultValue: 'fade',
      options: [
        {
          label: 'フェードイン',
          value: 'fade',
        },
        {
          label: 'スライドイン',
          value: 'slide',
        },
        {
          label: 'タイプライター',
          value: 'typewriter',
        },
        {
          label: 'バースト',
          value: 'burst',
        },
        {
          label: 'スターフィールド',
          value: 'starfield',
        },
        {
          label: 'ライトストリーク',
          value: 'lightstreak',
        },
        {
          label: 'ディスインテグレート',
          value: 'disintegrate',
        },
        {
          label: 'パララックス',
          value: 'parallax',
        },
      ],
    },
  ],
  interfaceName: 'SloganBlock',
} 