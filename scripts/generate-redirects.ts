import configPromise from '@payload-config'
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'

interface Redirect {
  from: string
  to?: {
    type?: 'reference' | 'custom' | null
    reference?: {
      relationTo: 'pages' | 'posts'
      value: string | any
    } | null
    url?: string | null
  }
}

async function generateRedirectFiles() {
  let payload: Awaited<ReturnType<typeof getPayload>> | undefined
  try {
    payload = await getPayload({ config: configPromise })

    const { docs: redirects } = await payload.find({
      collection: 'redirects',
      depth: 2,
      limit: 0,
      pagination: false,
    })

    const outputDir = path.join(process.cwd(), 'out')
    const redirectsFile = path.join(outputDir, '_redirects')
    const redirectRules: string[] = []
    
    for (const redirect of redirects as Redirect[]) {
      if (!redirect.from || !redirect.to) continue

      let redirectUrl: string
      if (redirect.to.url) {
        redirectUrl = redirect.to.url
      } else if (redirect.to.reference?.value) {
        const doc = redirect.to.reference.value
        const slug = typeof doc === 'string' ? doc : (doc as any).slug
        redirectUrl = redirect.to.reference.relationTo === 'pages' ? `/${slug}` : `/${redirect.to.reference.relationTo}/${slug}`
      } else {
        continue
      }

      redirectRules.push(`${redirect.from} ${redirectUrl} 301`)
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(redirectsFile, redirectRules.join('\n'))
  } finally {
    try {
      const anyPayload = payload as any
      if (anyPayload?.db?.destroy) await anyPayload.db.destroy()
      else if (anyPayload?.db?.close) await anyPayload.db.close()
      else if (anyPayload?.close) await anyPayload.close()
    } catch {}
  }
}

generateRedirectFiles()
  .then(() => { try { process.exit(0) } catch {} })
  .catch((e) => { console.error('[redirects] generation failed', e); try { process.exit(1) } catch {} })
