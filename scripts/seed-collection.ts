import type { CollectionSlug, Payload, PayloadRequest } from 'payload'
import fs from 'fs'
import path from 'path'

import { home } from './seed/home'
import { festival as festivalData } from './seed/festival'
import { messages } from './seed/message'
import { events } from './seed/events'
import { clubs } from './seed/clubs'
import { posts } from './seed/posts'
import { privacyPolicy } from './seed/privacy-policy'

const availableCollections = {
  media: async () => {
    console.log('Seeding media collection...')
    
    const mediaDir = path.resolve(process.cwd(), 'public/media')
    if (fs.existsSync(mediaDir)) {
      for (const file of fs.readdirSync(mediaDir)) {
        fs.unlinkSync(path.join(mediaDir, file))
      }
    }

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

    console.log('Media collection seeded successfully')
    return { mediaLight, mediaDark }
  },

  pages: async () => {
    console.log('Seeding pages collection...')
    
    await payload.db.deleteMany({ collection: 'pages', req, where: {} })
    await payload.db.deleteVersions({ collection: 'pages', req, where: {} })

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

    console.log('Pages collection seeded successfully')
  },

  posts: async () => {
    console.log('Seeding posts collection...')
    
    await payload.db.deleteMany({ collection: 'posts', req, where: {} })
    await payload.db.deleteVersions({ collection: 'posts', req, where: {} })

    for (const post of posts) {
      await payload.create({
        collection: 'posts',
        data: post as any,
        context: {
          disableRevalidate: true,
        },
      })
    }

    console.log('Posts collection seeded successfully')
  },

  messages: async () => {
    console.log('Seeding messages collection...')
    
    await payload.db.deleteMany({ collection: 'messages', req, where: {} })
    await payload.db.deleteVersions({ collection: 'messages', req, where: {} })

    for (const msg of messages) {
      await payload.create({
        collection: 'messages',
        data: msg,
        context: {
          disableRevalidate: true,
        },
      })
    }

    console.log('Messages collection seeded successfully')
  },

  events: async () => {
    console.log('Seeding events collection...')
    
    await payload.db.deleteMany({ collection: 'events', req, where: {} })
    await payload.db.deleteVersions({ collection: 'events', req, where: {} })

    const mediaResult = await availableCollections.media()
    const mediaLight = (mediaResult as any)?.mediaLight
    const mediaDark = (mediaResult as any)?.mediaDark

    for (let i = 0; i < events.length; i++) {
      const event = events[i] as any
      const mediaId = i === 0 ? mediaLight?.id : mediaDark?.id
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

    console.log('Events collection seeded successfully')
  },

  clubs: async () => {
    console.log('Seeding clubs collection...')
    
    await payload.db.deleteMany({ collection: 'clubs', req, where: {} })
    await payload.db.deleteVersions({ collection: 'clubs', req, where: {} })

    const mediaResult = await availableCollections.media()
    const mediaLight = (mediaResult as any)?.mediaLight
    const mediaDark = (mediaResult as any)?.mediaDark

    for (let i = 0; i < clubs.length; i++) {
      const club = clubs[i] as any
      const mediaId = i === 0 ? mediaLight?.id : mediaDark?.id
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

    console.log('Clubs collection seeded successfully')
  },
}

const availableGlobals = {
  header: async () => {
    console.log('Seeding header global...')
    
    await payload.updateGlobal({
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
              url: '/social',
            },
          },
        ],
      },
      context: {
        disableRevalidate: true,
      },
    })

    console.log('Header global seeded successfully')
  },

  footer: async () => {
    console.log('Seeding footer global...')
    
    await payload.updateGlobal({
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
    })

    console.log('Footer global seeded successfully')
  },

  festival: async () => {
    console.log('Seeding festival global...')
    
    await payload.updateGlobal({
      slug: 'festival',
      data: festivalData,
      context: {
        disableRevalidate: true,
      },
    })

    console.log('Festival global seeded successfully')
  },
}

let payload: Payload
let req: PayloadRequest

export const seedCollection = async ({
  payload: payloadInstance,
  req: reqInstance,
  collection,
}: {
  payload: Payload
  req: PayloadRequest
  collection: keyof typeof availableCollections | keyof typeof availableGlobals
}): Promise<void> => {
  payload = payloadInstance
  req = reqInstance

  payload.logger.info(`Seeding ${collection}...`)

  if (collection in availableCollections) {
    await availableCollections[collection as keyof typeof availableCollections]()
  } else if (collection in availableGlobals) {
    await availableGlobals[collection as keyof typeof availableGlobals]()
  } else {
    throw new Error(`Unknown collection: ${collection}`)
  }

  payload.logger.info(`Seeded ${collection} successfully!`)
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Please specify a collection name')
    console.log('Available collections:')
    console.log('  Collections: media, pages, posts, messages, events, clubs')
    console.log('  Globals: header, footer, festival')
    console.log('')
    console.log('Usage examples:')
    console.log('  pnpm seed:collection posts')
    console.log('  pnpm seed:collection events')
    console.log('  pnpm seed:collection festival')
    process.exit(1)
  }

  const collection = args[0] as keyof typeof availableCollections | keyof typeof availableGlobals
  
  console.log(`Starting to seed ${collection} collection...`)
  
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    
    const payloadInstance = await getPayload({ config: config.default })
    
    console.log('Connected to PayloadCMS')
    
    const mockReq = {
      user: {
        id: 'cli-seed-user',
        email: 'cli@example.com',
        collection: 'users',
      },
    } as any
    
    await seedCollection({ 
      payload: payloadInstance, 
      req: mockReq, 
      collection 
    })
    
    console.log(`${collection} collection seeded successfully!`)
    
    process.exit(0)
  } catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
