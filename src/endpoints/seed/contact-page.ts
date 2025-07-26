import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ContactArgs = {
  contactForm: Form
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
}) => {
  return {
    slug: "contact",
    _status: "published",
    hero: {
      type: 'textOnly',
      text: 'お問い合わせ',
    },
    layout: [
      {
        blockType: 'formBlock',
        enableIntro: false,
        form: contactForm,
      },
    ],
    title: "お問い合わせ",
    meta: {
      title: "お問い合わせ",
    },
  };
};
