import type { GlobalConfig } from 'payload'

export const Sponsors: GlobalConfig = {
  slug: 'sponsors',
  label: 'スポンサー',
  admin: {
    group: 'コンテンツ管理',
  },
  fields: [
    {
      name: 'sponsors',
      type: 'array',
      label: 'スポンサー',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: '表示タイプ',
          required: true,
          options: [
            { label: 'ロゴ掲載（大）', value: 'logoLarge' },
            { label: 'ロゴ掲載（小）', value: 'logoSmall' },
            { label: '会社名掲載（テキスト）', value: 'textOnly' },
          ],
        },
        {
          name: 'companyName',
          type: 'text',
          label: '会社名',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'ロゴ画像',
          required: true,
          admin: {
            condition: (_data, siblingData) => {
              return siblingData?.type === 'logoLarge' || siblingData?.type === 'logoSmall'
            },
            description:
              '推奨: ロゴ（大）1200×400 PNG透過/SVG 200KB以内、ロゴ（小）600×200 PNG透過/SVG 120KB以内。枠内に中央配置・等比率でフィットします。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            description: 'スポンサーのURL',
          },
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
