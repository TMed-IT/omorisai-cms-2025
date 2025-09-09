import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'
import { canAccessAdminPanel } from '@/access/canAccessAdminPanel'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { slugField } from '@/fields/slug'

const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: 'メッセージ',
    plural: 'メッセージ',
  },
  access: {
    admin: canAccessAdminPanel,
    create: isEditorOrAdmin,
    delete: isEditorOrAdmin,
    read: authenticatedOrPublished,
    update: isEditorOrAdmin,
  },
  admin: {
    defaultColumns: ['position', 'name', 'order', 'slug'],
    group: 'コンテンツ管理',
    useAsTitle: 'position',
  },
  defaultSort: 'order',
  hooks: {},
  fields: [
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: '顔写真',
    },
    ...slugField('name', {
      slugOverrides: {
        required: true,
        unique: true,
      },
    }),
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
      name: 'order',
      type: 'number',
      label: '表示順',
      admin: {
        description: '小さいほど上に表示されます',
        position: 'sidebar',
      },
      defaultValue: 0,
      index: true,
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