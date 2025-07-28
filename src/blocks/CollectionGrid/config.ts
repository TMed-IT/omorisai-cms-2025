import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const CollectionGrid: Block = {
  slug: 'collectionGrid',
  interfaceName: 'CollectionGridBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'イントロコンテンツ',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'コレクションから',
          value: 'collection',
        },
        {
          label: '個別選択',
          value: 'selection',
        },
      ],
      label: '表示方法',
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 'posts',
      label: '表示するコレクション',
      options: [
        {
          label: 'お知らせ',
          value: 'posts',
        },
        {
          label: 'イベント',
          value: 'events',
        },
        {
          label: '部活動',
          value: 'clubs',
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: '表示上限',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: '選択',
      relationTo: ['posts', 'events', 'clubs'],
    },
  ],
  labels: {
    plural: 'コレクショングリッド',
    singular: 'コレクショングリッド',
  },
} 