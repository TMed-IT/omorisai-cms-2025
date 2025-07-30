import type { CollectionConfig } from 'payload'

const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'イベント',
    plural: 'イベント',
  },
  admin: {
    defaultColumns: ['title', 'date', 'location'],
    group: 'コンテンツ管理',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'イベント名',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'スラッグ',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: '日時',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: '場所',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'サムネイル',
    },
  ],
}

export default Events 