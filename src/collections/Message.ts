import type { CollectionConfig } from 'payload'

const Message: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
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
    },
  ],
}

export default Message 