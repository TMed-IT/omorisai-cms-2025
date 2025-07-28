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
        blockName: 'スローガン',
        blockType: 'slogan',
        showEnglish: true,
        showJapanese: true,
        showDescription: true,
        animationType: 'fade',
      },
      {
        blockName: 'フェスティバル情報',
        blockType: 'festivalInfo',
        showSchedule: true,
        showLocation: true,
        dateFormat: {
          startDateFormat: 'YYYY/MM/D',
          endDateFormat: 'D',
        },
      },
      {
        blockName: 'カウントダウン',
        blockType: 'countdown',
        showCountdown: false,
        announcementText: '開催日時は後日発表予定です',
        noticeText: '詳細が決まり次第、こちらのサイトとSNSでお知らせいたします',
      },
      {
        blockName: 'お知らせ一覧',
        blockType: 'collectionList',
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
                    text: '最新のお知らせ',
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
        limit: 5,
      },
    ],
    meta: {
      title: 'ホーム',
    },
    title: 'ホーム',
  }
}
