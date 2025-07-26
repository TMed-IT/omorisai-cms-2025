import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PostArchive: Block = {
  slug: 'postArchive',
  interfaceName: 'PostArchiveBlock',
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
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      label: '表示上限',
    },
  ],
  labels: {
    plural: 'お知らせアーカイブ',
    singular: 'お知らせアーカイブ',
  },
} 