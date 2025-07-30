import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import fs from 'fs'
import path from 'path'


import { home } from './home'
import { eventsPage } from './events-page'
import { festival as festivalData } from './festival'
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
const globals: GlobalSlug[] = ['header', 'footer', 'festival']

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
        data: global === 'festival' ? festivalData : {},
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

  const placeholderLightPath = path.resolve(process.cwd(), 'src/endpoints/seed/placeholder_light.png')
  const placeholderDarkPath = path.resolve(process.cwd(), 'src/endpoints/seed/placeholder_dark.png')

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
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: eventsPage(),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: privacyPolicy(),
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
              url: '/social',
            },
          },
        ],
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
    }),
    payload.updateGlobal({
      slug: 'festival',
      data: festivalData,
    }),
  ])

  payload.logger.info(`— Seeding messages...`)
  for (const msg of messages) {
    await payload.create({
      collection: 'messages',
      data: msg,
    })
  }

  payload.logger.info(`— Seeding events...`)
  for (let i = 0; i < events.length; i++) {
    const event = events[i] as any
    const mediaId = i === 0 ? mediaLight.id : mediaDark.id
    await payload.create({
      collection: 'events',
      data: {
        ...event,
        thumbnail: mediaId,
      },
    })
  }

  payload.logger.info(`— Seeding clubs...`)
  for (let i = 0; i < clubs.length; i++) {
    const club = clubs[i] as any
    const mediaId = i === 0 ? mediaLight.id : mediaDark.id
    await payload.create({
      collection: 'clubs',
      data: {
        ...club,
        image: mediaId,
      },
    })
  }

  payload.logger.info(`— Seeding posts...`)
  for (const post of posts) {
    await payload.create({
      collection: 'posts',
      data: post as any,
    })
  }

  payload.logger.info('Seeded database successfully!')
}