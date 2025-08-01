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
    english: 'Fusion',
    japanese: '和',
    description: '融合とは、異なる要素が一つに溶け合い、新たな価値を生み出すことを指します。\n大森祭では、音楽、ダンス、美術など、多様な表現や出し物が行われます。そうした異なる分野の要素を調和させ、組み合わせることで、新たな創造や交流を生み出すことを期待しています。',
  },
  socialLinks: [
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/tohoomorisai/',
    },
  ],
} 