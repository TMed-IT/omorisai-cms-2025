import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'

const revalidateSocialLinks: GlobalAfterChangeHook = ({ doc: _doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('global_socialLinks')
  }
}

export const SocialLinks: GlobalConfig = {
  slug: 'socialLinks',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  label: 'SNSリンク',
  admin: {
    group: 'コンテンツ管理',
  },
  hooks: {
    afterChange: [revalidateSocialLinks],
  },
  fields: [
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
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
  },
}
