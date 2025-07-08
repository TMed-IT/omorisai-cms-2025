import type { CollectionConfig } from 'payload'

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'イベント名',
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