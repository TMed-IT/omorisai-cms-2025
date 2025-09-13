import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: '大森祭の公式ウェブサイトです。イベント情報、お知らせなどを掲載しています。',
  images: [
    {
      url: `${getServerSideURL()}/OG.webp`,
      width: 1200,
      height: 630,
      alt: '大森祭ウェブサイト',
    },
  ],
  siteName: '大森祭ウェブサイト',
  title: '大森祭ウェブサイト',
  locale: 'ja_JP',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
