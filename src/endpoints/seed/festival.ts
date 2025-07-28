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
  slogan: {
    english: 'Innovation Meets Tradition',
    japanese: '創造と革新が交差する、未来への扉を開く文化祭',
    description: '東邦大学大森キャンパスで開催される、学生たちの創造性と技術が融合する文化祭です。',
  },
  socialLinks: [
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/tohoomorisai/',
    },
  ],
} 