import type { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'なし',
          value: 'none',
        },
        {
          label: 'テキストと画像',
          value: 'textAndImage',
        },
        {
          label: 'テキストのみ',
          value: 'textOnly',
        },
      ],
      required: true,
    },
    {
      name: 'text',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
      },
      label: 'タイトル',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => type === 'textAndImage',
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
