import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { canAccessAdminPanel } from '../access/canAccessAdminPanel'
import { anyone } from '../access/anyone'

const Clubs: CollectionConfig = {
  slug: 'clubs',
  labels: {
    singular: '部活紹介',
    plural: '部活紹介',
  },
  access: {
    admin: canAccessAdminPanel,
    create: isEditorOrAdmin,
    delete: isEditorOrAdmin,
    read: anyone,
    update: isEditorOrAdmin,
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

export default Clubs 