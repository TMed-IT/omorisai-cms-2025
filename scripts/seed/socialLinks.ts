import type { SocialLink } from '@/payload-types'

type SocialLinkSeedData = Omit<SocialLink, 'id'>

export const socialLinks: SocialLinkSeedData = {
  socialLinks: [
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/tohoomorisai/',
    },
  ],
}
