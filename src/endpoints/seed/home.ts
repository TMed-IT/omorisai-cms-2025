import type { RequiredDataFromCollectionSlug } from 'payload'

export const home: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'none'
    },
    layout: [
      {
        blockName: 'トップ',
        blockType: 'festivalTop',
        showCountdown: false,
        showSlogan: true,
        showSchedule: true,
        showLocation: true,
        announcementText: '開催日時は後日発表予定です',
        slogan: '創造と革新が交差する、未来への扉を開く文化祭',
        dateFormat: {
          startDateFormat: 'YYYY/MM/D',
          endDateFormat: 'D',
        },
      },
      {
        blockName: 'お知らせ一覧',
        blockType: 'archive',
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
                    text: 'お知らせ',
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
        relationTo: 'posts',
      },
    ],
    meta: {
      title: 'ホーム',
    },
    title: 'ホーム',
  }
}
