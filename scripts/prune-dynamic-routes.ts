// @ts-nocheck
/*
  Prune dynamic route directories for static export when there are zero docs.
  Uses Payload to count published items and removes corresponding route dirs.
*/
import fs from 'node:fs'
import path from 'node:path'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

type PruneTarget = {
  collection: string
  routeDir: string
  // Optional custom count function
  count?: (payload: Awaited<ReturnType<typeof getPayload>>) => Promise<number>
}

const removeDirIfExists = (dir: string) => {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
      console.log(`[prune] removed: ${dir}`)
    } else {
      console.log(`[prune] skip (missing): ${dir}`)
    }
  } catch (err) {
    console.warn(`[prune] failed to remove ${dir}:`, err)
  }
}

async function main() {
  let payload
  try {
    payload = await getPayload({ config: configPromise })
  } catch (err) {
    console.warn('[prune] getPayload failed; skip pruning. Error:', err)
    return
  }

  const appDir = path.resolve(process.cwd(), 'src/app/(frontend)')

  const targets: PruneTarget[] = [
    {
      collection: 'messages',
      routeDir: path.join(appDir, 'message/[slug]'),
      count: async (p) => {
        // messages has drafts enabled
        const { totalDocs } = await p.count({
          collection: 'messages',
          where: { _status: { equals: 'published' } },
          overrideAccess: true,
        })
        return totalDocs
      },
    },
    {
      collection: 'events',
      routeDir: path.join(appDir, 'events/[slug]'),
      count: async (p) => {
        // events: treat same as others (only published)
        const { totalDocs } = await p.count({
          collection: 'events',
          where: { _status: { equals: 'published' } },
          overrideAccess: true,
        })
        return totalDocs
      },
    },
    {
      collection: 'posts',
      routeDir: path.join(appDir, 'posts/[slug]'),
      count: async (p) => {
        const { totalDocs } = await p.count({
          collection: 'posts',
          where: { _status: { equals: 'published' } },
          overrideAccess: true,
        })
        return totalDocs
      },
    },
    {
      collection: 'posts',
      routeDir: path.join(appDir, 'posts/page/[pageNumber]'),
      count: async (p) => {
        const { totalDocs } = await p.count({ collection: 'posts', overrideAccess: true })
        const totalPages = Math.ceil(totalDocs / 10)
        return totalPages
      },
    },
    {
      collection: 'pages',
      routeDir: path.join(appDir, '[slug]'),
      count: async (p) => {
        // pages has drafts; exclude home and only published
        const { totalDocs } = await p.count({
          collection: 'pages',
          where: { slug: { not_equals: 'home' }, _status: { equals: 'published' } },
          overrideAccess: true,
        })
        return totalDocs
      },
    },
  ]

  for (const t of targets) {
    try {
      let count = 0
      count = t.count ? await t.count(payload) : (await payload.count({ collection: t.collection, overrideAccess: true })).totalDocs

      if (!count || count < 1) {
        removeDirIfExists(t.routeDir)
      } else {
        console.log(`[prune] keep: ${t.routeDir} (count=${count})`)
      }
    } catch (err) {
      console.warn(`[prune] error while checking ${t.collection}:`, err)
    }
  }

  // Attempt to gracefully close DB connections to allow process exit
  try {
    const anyPayload = payload as any
    if (anyPayload?.db?.destroy) await anyPayload.db.destroy()
    else if (anyPayload?.db?.close) await anyPayload.db.close()
    else if (anyPayload?.close) await anyPayload.close()
  } catch (err) {
    // ignore
  }

  // Ensure process exits so build script can continue
  try {
    // eslint-disable-next-line n/no-process-exit
    process.exit(0)
  } catch {}
}

void main()
