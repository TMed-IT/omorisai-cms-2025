import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  let draft = false
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true') {
    const { draftMode } = await import('next/headers')
    draft = (await draftMode()).isEnabled
  }

  const global = await payload.findGlobal({
    slug,
    draft,
    overrideAccess: draft,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
