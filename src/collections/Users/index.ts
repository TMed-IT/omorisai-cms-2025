import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { validateEmail } from '../../utilities/validateEmail'
import { EmailValidationError, NameValidationError } from '../../utilities/errors'

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
      name: 'lastName',
      type: 'text',
      label: '姓',
    },
    {
      name: 'firstName',
      type: 'text',
      label: '名',
    },
    {
      name: 'lastNameRoman',
      type: 'text',
      label: '姓（ローマ字）',
    },
    {
      name: 'firstNameRoman',
      type: 'text',
      label: '名（ローマ字）',
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
        if (data?.lastName) {
          const lastName = data.lastName as string
          if (!lastName.trim()) {
            throw new NameValidationError('姓を入力してください')
          }
          if (/\s/.test(lastName)) {
            throw new NameValidationError('姓にスペースを含めないでください')
          }
        }
        if (data?.firstName) {
          const firstName = data.firstName as string
          if (!firstName.trim()) {
            throw new NameValidationError('名を入力してください')
          }
          if (/\s/.test(firstName)) {
            throw new NameValidationError('名にスペースを含めないでください')
          }
        }
        if (data?.lastNameRoman) {
          let lastNameRoman = data.lastNameRoman as string
          if (!/^[A-Za-z]+$/.test(lastNameRoman)) {
            throw new NameValidationError('姓（ローマ字）は半角英字のみで入力してください')
          }
          data.lastNameRoman = lastNameRoman.charAt(0).toUpperCase() + lastNameRoman.slice(1).toLowerCase()
        }
        if (data?.firstNameRoman) {
          let firstNameRoman = data.firstNameRoman as string
          if (!/^[A-Za-z]+$/.test(firstNameRoman)) {
            throw new NameValidationError('名（ローマ字）は半角英字のみで入力してください')
          }
          data.firstNameRoman = firstNameRoman.charAt(0).toUpperCase() + firstNameRoman.slice(1).toLowerCase()
        }
        return data
      },
    ],
  },
  timestamps: true,
}
