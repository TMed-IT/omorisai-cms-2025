import type { PageMetadatum } from '@/payload-types'

type PageMetadataSeedData = Omit<PageMetadatum, 'id'>

export const pageMetadata: PageMetadataSeedData = {
  events: {
    description: '大森祭のイベント一覧ページです。',
  },
  messages: {
    description: '大森祭のメッセージ一覧ページです。',
  },
  posts: {
    description: '大森祭のお知らせ一覧ページです。',
  },
  socials: {
    description: '大森祭のSNSページです。',
  },
  clubs: {
    description: '大森祭のクラブ一覧ページです。',
  },
}
