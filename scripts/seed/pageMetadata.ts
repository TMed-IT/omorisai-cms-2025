import type { PageMetadatum } from '@/payload-types'

type PageMetadataSeedData = Omit<PageMetadatum, 'id'>

export const pageMetadata: PageMetadataSeedData = {
  events: {
    title: 'Events - 大森祭',
    description: '大森祭のイベント一覧ページです。',
  },
  message: {
    title: 'Message - 大森祭',
    description: '大森祭のメッセージ一覧ページです。',
  },
  posts: {
    title: 'お知らせ一覧 - 大森祭',
    description: '大森祭のお知らせ一覧ページです。',
  },
  socials: {
    title: 'SNS - 大森祭',
    description: '大森祭のSNSページです。',
  },
  clubs: {
    title: 'Clubs - 大森祭',
    description: '大森祭のクラブ一覧ページです。',
  },
}
