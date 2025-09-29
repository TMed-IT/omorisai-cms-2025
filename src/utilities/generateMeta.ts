import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getMediaUrl } from './getMediaUrl'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const raw = image.sizes?.og?.url || image.url
    const canonical = getMediaUrl(raw)
    url = canonical.startsWith('http://') || canonical.startsWith('https://')
      ? canonical
      : serverUrl + canonical
  }

  return url
}

export const generateMeta = async (args: {
  doc?: Partial<Page> | Partial<Post> | null
  defaultTitle?: string
  defaultDescription?: string
  staticPageMetadata?: {
    title?: string
    description?: string
    ogImage?: any
  }
  computedTitle?: string
}): Promise<Metadata> => {
  const { doc, defaultTitle, defaultDescription, staticPageMetadata, computedTitle } = args

  const ogImage = getImageURL(doc?.meta?.image || staticPageMetadata?.ogImage)

  const title = doc?.meta?.title
    ? doc.meta.title
    : computedTitle
      ? computedTitle
      : staticPageMetadata?.title
      ? staticPageMetadata.title
      : defaultTitle 
        ? `${defaultTitle} - 大森祭ウェブサイト`
        : '大森祭ウェブサイト'

  const description = doc?.meta?.description || staticPageMetadata?.description || defaultDescription || ''

  return {
    title,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
  }
}
