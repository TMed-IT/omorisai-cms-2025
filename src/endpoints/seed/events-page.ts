import type { RequiredDataFromCollectionSlug } from 'payload'

export const eventsPage: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    slug: 'events',
    _status: 'published',
    hero: {
      type: 'textOnly',
      text: 'イベント一覧',
    },
    layout: [
      {
        blockName: 'イベント一覧（グリッド）',
        blockType: 'collectionGrid',
        introContent: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'イベント',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                tag: 'h3',
                version: 1,
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        populateBy: 'collection',
        relationTo: 'events',
        limit: 8,
      },
    ],
    meta: {
      title: 'イベント一覧',
    },
    title: 'イベント一覧',
  }
} 