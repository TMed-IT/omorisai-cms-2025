import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { canAccessAdminPanel } from '../access/canAccessAdminPanel'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

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
    read: authenticatedOrPublished,
    update: isEditorOrAdmin,
  },
  admin: {
    defaultColumns: ['title', 'dates', 'location'],
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
      name: 'dates',
      type: 'array',
      required: true,
      label: '日時',
      fields: [
        {
          name: 'start',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              timeIntervals: 5,
            },
          },
          required: true,
          label: '開始日時',
        },
        {
          name: 'end',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              timeIntervals: 5,
            },
          },
          required: false,
          label: '終了時刻',
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: '場所',
    },
    {
      name: 'content',
      type: 'richText',
      label: '詳細',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'サムネイル',
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

export default Events 
