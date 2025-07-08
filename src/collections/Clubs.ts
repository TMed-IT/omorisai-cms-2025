import type { CollectionConfig } from 'payload'

const Clubs: CollectionConfig = {
  slug: 'clubs',
  admin: {
    useAsTitle: 'name',
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