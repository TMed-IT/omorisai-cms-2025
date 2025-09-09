import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { canAccessAdminPanel } from '../access/canAccessAdminPanel'
import { MediaExtensionNotAllowedError } from '@/utilities/errors'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'メディア',
    plural: 'メディア',
  },
  access: {
    admin: canAccessAdminPanel,
    create: isEditorOrAdmin,
    delete: isEditorOrAdmin,
    read: anyone,
    update: isEditorOrAdmin,
  },
  admin: {
    group: 'メディア管理',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '代替テキスト',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: 'キャプション',
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '@/public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'],
  },
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data) return data
        const mime = (data as any).mimeType as string | undefined
        const filename = (data as any).filename as string | undefined
        const allowedMimes = new Set(['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
        if (mime && !allowedMimes.has(mime)) {
          throw new MediaExtensionNotAllowedError('対応していない拡張子です')
        }
        if (filename && !mime) {
          const ext = filename.split('.').pop()?.toLowerCase()
          const allowedExts = new Set(['jpg','jpeg','png','webp','gif','svg'])
          if (!ext || !allowedExts.has(ext)) {
            throw new MediaExtensionNotAllowedError('対応していない拡張子です')
          }
        }
        return data
      },
    ],
  },
}
