import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: 'メッセージ',
    plural: 'メッセージ',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['position', 'name', 'slug'],
    group: 'コンテンツ管理',
    useAsTitle: 'position',
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.slug) {
          const messages = await req.payload.find({
            collection: 'messages',
            sort: '-slug',
            limit: 1,
          })
          
          let nextNumber = 1
          if (messages.docs.length > 0 && messages.docs[0] && messages.docs[0].slug) {
            const maxSlug = parseInt(messages.docs[0].slug, 10)
            if (!isNaN(maxSlug)) {
              nextNumber = maxSlug + 1
            }
          }
          
          data.slug = nextNumber.toString()
        }
        
        return data
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: '自動生成されます',
      },
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      label: '役職',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '名前',
    },
    {
      name: 'message',
      type: 'richText',
      required: true,
      label: '挨拶文',
      editor: defaultLexical,
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: false,
    },
    maxPerDoc: 50,
  },
}

export default Messages 