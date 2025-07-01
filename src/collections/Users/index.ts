import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { validateEmail } from '../../utilities/validateEmail'
import { EmailValidationError } from '../../utilities/errors'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'ユーザー',
    plural: 'ユーザー',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    group: 'ユーザー管理',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '名前',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email) {
          const email = data.email as string
          const validationResult = validateEmail(email)
          
          if (validationResult !== true) {
            throw new EmailValidationError(validationResult)
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}
