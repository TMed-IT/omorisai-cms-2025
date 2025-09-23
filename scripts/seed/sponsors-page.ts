import type { RequiredDataFromCollectionSlug } from 'payload'

export const sponsorsPage: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    slug: 'sponsors',
    _status: 'published',
    title: 'スポンサー',
    hero: {
      type: 'textOnly',
      text: 'Sponsors',
    },
    layout: [
      {
        blockName: 'スポンサー',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '大森祭を支えてくださるスポンサーの皆さまをご紹介します。',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            enableLink: false,
            link: {
              type: 'reference',
              appearance: 'default',
              label: '',
            },
          },
        ],
      },
      {
        blockName: 'スポンサー',
        blockType: 'sponsorBlock',
      },
    ],
    meta: {
      title: 'スポンサー - 大森祭',
    },
  }
}
