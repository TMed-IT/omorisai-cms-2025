import type { Sponsor } from '@/payload-types'

type SponsorSeedData = Omit<Sponsor, 'id'>

export const sponsors: SponsorSeedData = {
  sponsors: [
    {
      type: 'logoLarge',
      companyName: 'サンプルスポンサー1',
      logo: null,
      url: 'https://example.com',
    },
    {
      type: 'logoSmall',
      companyName: 'サンプルスポンサー2',
      logo: null,
      url: 'https://example.com',
    },
    {
      type: 'textOnly',
      companyName: 'サンプルスポンサー3',
      logo: null,
      url: 'https://example.com',
    },
  ],
}
