import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import fs from 'fs'
import path from 'path'


import { home } from './home'
import { festival as festivalData } from './festival'
import { socialLinks as socialLinksData } from './socialLinks'
import { pageMetadata as pageMetadataData } from './pageMetadata'
import { sponsors as sponsorsData } from './sponsors'
import { messages } from './message'
import { events } from './events'
import { clubs } from './clubs'
import { posts } from './posts'
import { privacyPolicy } from './privacy-policy'

const allCollections: CollectionSlug[] = [
  'media',
  'pages',
  'posts',
  'messages',
  'events',
  'clubs',
]
const globals: GlobalSlug[] = ['header', 'footer', 'festival', 'socialLinks', 'pageMetadata', 'sponsors']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  const mediaDir = path.resolve(process.cwd(), 'public/media')
  if (fs.existsSync(mediaDir)) {
    for (const file of fs.readdirSync(mediaDir)) {
      fs.unlinkSync(path.join(mediaDir, file))
    }
  }

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: global === 'festival' ? festivalData : 
              global === 'socialLinks' ? socialLinksData :
              global === 'pageMetadata' ? pageMetadataData :
              global === 'sponsors' ? sponsorsData : {},
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    allCollections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    allCollections
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding media...`)

  const placeholderLightPath = path.resolve(process.cwd(), 'scripts/seed/placeholder_light.png')
  const placeholderDarkPath = path.resolve(process.cwd(), 'scripts/seed/placeholder_dark.png')

  const placeholderLightBuffer = fs.readFileSync(placeholderLightPath)
  const placeholderDarkBuffer = fs.readFileSync(placeholderDarkPath)

  const [mediaLight, mediaDark] = await Promise.all([
    payload.create({
      collection: 'media',
      data: {
        alt: 'Placeholder light image with colorful abstract elements',
      },
      file: {
        data: placeholderLightBuffer,
        mimetype: 'image/png',
        name: 'placeholder_light.png',
        size: placeholderLightBuffer.length,
      },
    }),
    payload.create({
      collection: 'media',
      data: {
        alt: 'Placeholder dark image with white abstract shapes',
      },
      file: {
        data: placeholderDarkBuffer,
        mimetype: 'image/png',
        name: 'placeholder_dark.png',
        size: placeholderDarkBuffer.length,
      },
    }),
  ])

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home(),
      context: {
        disableRevalidate: true,
      },
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: privacyPolicy(),
      context: {
        disableRevalidate: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Message',
              url: '/message',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Events',
              url: '/events',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'SNS',
              url: '/socials',
            },
          },
        ],
      },
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'プライバシーポリシー',
              url: '/privacy',
            },
          },
        ],
      },
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'festival',
      data: festivalData,
      context: {
        disableRevalidate: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding messages...`)
  for (const msg of messages) {
    await payload.create({
      collection: 'messages',
      data: msg,
      context: {
        disableRevalidate: true,
      },
    })
  }

  payload.logger.info(`— Seeding events...`)
  for (let i = 0; i < events.length; i++) {
    const event = events[i] as any // eslint-disable-line @typescript-eslint/no-explicit-any
    const mediaId = i === 0 ? mediaLight.id : mediaDark.id
    await payload.create({
      collection: 'events',
      data: {
        ...event,
        thumbnail: mediaId,
      },
      context: {
        disableRevalidate: true,
      },
    })
  }

  payload.logger.info(`— Seeding clubs...`)
  for (let i = 0; i < clubs.length; i++) {
    const club = clubs[i] as any // eslint-disable-line @typescript-eslint/no-explicit-any
    const mediaId = i === 0 ? mediaLight.id : mediaDark.id
    await payload.create({
      collection: 'clubs',
      data: {
        ...club,
        image: mediaId,
      },
      context: {
        disableRevalidate: true,
      },
    })
  }

  payload.logger.info(`— Seeding posts...`)
  for (const post of posts) {
    await payload.create({
      collection: 'posts',
      data: post as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      context: {
        disableRevalidate: true,
      },
    })
  }

  payload.logger.info('Seeded database successfully!')
}

// CLI実行用のメイン関数
async function main() {
  console.log('Starting database initialization...')
  
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    
    const payload = await getPayload({ config: config.default })
    
    console.log('Connected to PayloadCMS')
    
    const mockReq = {
      user: {
        id: 'cli-seed-user',
        email: 'cli@example.com',
        collection: 'users',
      },
    } as any
    
    await seed({ payload, req: mockReq })
    
    console.log('Database initialization completed successfully!')
    console.log('Check the website at: http://localhost:3000')
    
    process.exit(0)
  } catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  }
}

// CLIから直接実行された場合のみmain関数を実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}