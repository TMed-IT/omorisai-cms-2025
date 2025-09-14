import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

const revalidateFestival: GlobalAfterChangeHook = ({ doc: _doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('global_festival')
  }
}

export const Festival: GlobalConfig = {
  slug: 'festival',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  label: '基本設定',
  admin: {
    group: 'コンテンツ管理',
  },
  hooks: {
    afterChange: [revalidateFestival],
  },
  fields: [
    {
      name: 'festivalInfo',
      type: 'group',
      label: '開催情報',
      fields: [
        {
          name: 'year',
          type: 'text',
          label: '開催年',
          required: true,
        },
        {
          name: 'startDate',
          type: 'date',
          label: '開始日',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          label: '終了日',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
          label: '開催場所',
          required: true,
        },
      ],
    },
    {
      name: 'slogan',
      type: 'group',
      label: 'スローガン設定',
      fields: [
        {
          name: 'english',
          type: 'text',
          label: '英語スローガン',
          required: false,
        },
        {
          name: 'japanese',
          type: 'text',
          label: '日本語スローガン',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          label: '説明文',
          required: false,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'SNSリンク',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'ラベル',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'アイコン画像',
          required: false,
        },
      ],
    },
    {
      name: 'pageMetadata',
      type: 'group',
      label: 'ページメタデータ',
      fields: [
        {
          name: 'events',
          type: 'group',
          label: 'イベント一覧ページ',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'ページタイトル',
              defaultValue: 'Events - 大森祭',
            },
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
          name: 'message',
          type: 'group',
          label: 'メッセージ一覧ページ',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'ページタイトル',
              defaultValue: 'Message - 大森祭',
            },
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
              name: 'title',
              type: 'text',
              label: 'ページタイトル',
              defaultValue: 'お知らせ一覧 - 大森祭',
            },
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
              name: 'title',
              type: 'text',
              label: 'ページタイトル',
              defaultValue: 'SNS - 大森祭',
            },
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
              name: 'title',
              type: 'text',
              label: 'ページタイトル',
              defaultValue: 'Clubs - 大森祭',
            },
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
    },
  ],
} 