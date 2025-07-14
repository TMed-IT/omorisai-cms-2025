import type { CollectionConfig } from 'payload'

const Clubs: CollectionConfig = {
  slug: 'clubs',
  labels: {
    singular: '部活紹介',
    plural: '部活紹介',
  },
  admin: {
    defaultColumns: ['name', 'image'],
    group: 'コンテンツ管理',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '部活名',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: '説明',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: '画像',
    },
  ],
}

export default Clubs 