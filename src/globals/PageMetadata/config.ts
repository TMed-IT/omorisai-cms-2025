import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

const revalidatePageMetadata: GlobalAfterChangeHook = ({ doc: _doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('global_pageMetadata')
  }
}

export const PageMetadata: GlobalConfig = {
  slug: 'pageMetadata',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  label: 'メタデータ',
  admin: {
    group: 'サイト設定',
  },
  hooks: {
    afterChange: [revalidatePageMetadata],
  },
  fields: [
    {
      name: 'events',
      type: 'group',
      label: 'イベント一覧ページ',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'ページ説明',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG画像',
        },
      ],
    },
    {
      name: 'messages',
      type: 'group',
      label: 'メッセージ一覧ページ',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'ページ説明',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG画像',
        },
      ],
    },
    {
      name: 'posts',
      type: 'group',
      label: 'お知らせ一覧ページ',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'ページ説明',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG画像',
        },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      label: 'SNSページ',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'ページ説明',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG画像',
        },
      ],
    },
    {
      name: 'clubs',
      type: 'group',
      label: 'クラブ一覧ページ',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'ページ説明',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG画像',
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
  },
}
