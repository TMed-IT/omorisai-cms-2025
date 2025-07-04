import type { Festival } from '@/payload-types'

type FestivalSeedData = Omit<Festival, 'id'>

const thisYear = new Date().getFullYear().toString()
export const festival: FestivalSeedData = {
  festivalInfo: {
    year: thisYear,
    startDate: `${thisYear}-11-01`,
    endDate: `${thisYear}-11-02`,
    location: '東邦大学大森キャンパス',
  },
  socialLinks: [
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/tohoomorisai/',
    },
  ],
} 