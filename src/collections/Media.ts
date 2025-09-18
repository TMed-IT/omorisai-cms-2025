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
import { MediaExtensionNotAllowedError, MediaFilenameInvalidError } from '@/utilities/errors'
import { isStaticExport } from '@/utilities/isStaticExport'

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
    // Upload to Next.js public/media so files are available for static export without env config
    staticDir: path.resolve(process.cwd(), 'public/media'),
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
        if (filename) {
          const lastDotIndex = filename.lastIndexOf('.')
          const baseName = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename
          const allowedChars = /^[A-Za-z0-9-]+$/
          if (!allowedChars.test(baseName)) {
            throw new MediaFilenameInvalidError('ファイル名は英数字とハイフン(-)のみ使用できます')
          }
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // 環境に応じてURLを適切に処理
        const normalize = (u: string | undefined | null) => {
          if (!u || typeof u !== 'string') return u
          
          if (isStaticExport()) {
            // Static export時は /media/ をそのまま使用
            return u
              .replace(/^\/api\/media\/file\//, '/media/')
              .replace(/^\/api\/media\//, '/media/')
          } else {
            // 本番環境ではAPI経由で取得（ファイル配信専用ルートにマップ）
            return u
              .replace(/^\/media\//, '/api/media/file/')
          }
        }

        const anyDoc: any = doc
        if (anyDoc.url) anyDoc.url = normalize(anyDoc.url)
        if (anyDoc.sizes && typeof anyDoc.sizes === 'object') {
          for (const key of Object.keys(anyDoc.sizes)) {
            const s = anyDoc.sizes[key]
            if (s && typeof s === 'object' && 'url' in s) {
              s.url = normalize((s as any).url)
            }
          }
        }
        return doc
      },
    ],
  },
}
