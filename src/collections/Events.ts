import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { canAccessAdminPanel } from '../access/canAccessAdminPanel'
import { anyone } from '../access/anyone'

const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'イベント',
    plural: 'イベント',
  },
  access: {
    admin: canAccessAdminPanel,
    create: isEditorOrAdmin,
    delete: isEditorOrAdmin,
    read: anyone,
    update: isEditorOrAdmin,
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
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 5,
        },
      },
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