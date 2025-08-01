import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { canAccessAdminPanel } from '@/access/canAccessAdminPanel'
import { validateEmail } from '@/utilities/validateEmail'
import { EmailValidationError, NameValidationError } from '@/utilities/errors'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'ユーザー',
    plural: 'ユーザー',
  },
  access: {
    admin: canAccessAdminPanel,
    create: ({ req }) => {
      if (!req.user) return true
      return adminOnly({ req })
    },
    delete: adminOnly,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: ({ req: { user }, id, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.id === id && data ) {
        return true
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['lastName', 'firstName', 'lastNameRoman', 'firstNameRoman', 'email', 'role'],
    group: 'ユーザー管理',
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      label: 'ID',
      admin: {
        readOnly: true,
        description: 'メールアドレスに基づいて自動生成されます',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: '権限',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: '管理者',
          value: 'admin',
        },
        {
          label: '編集者',
          value: 'editor',
        },
      ],
      admin: {
        description: '管理者は全ての機能にアクセスでき、編集者はユーザー管理以外の機能にアクセスできます。',
      },
    },
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
      async ({ data, req }) => {
        if (!data) return data
        
        if (data?.email) {
          const email = data.email as string
          const validationResult = validateEmail(email)
          if (validationResult !== true) {
            throw new EmailValidationError(validationResult)
          }
          
          const atIndex = email.indexOf('@')
          if (atIndex !== -1) {
            data.id = email.substring(0, atIndex)
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
          const lastNameRoman = data.lastNameRoman as string
          if (!/^[A-Za-z]+$/.test(lastNameRoman)) {
            throw new NameValidationError('姓（ローマ字）は半角英字のみで入力してください')
          }
          data.lastNameRoman = lastNameRoman.charAt(0).toUpperCase() + lastNameRoman.slice(1).toLowerCase()
        }
        if (data?.firstNameRoman) {
          const firstNameRoman = data.firstNameRoman as string
          if (!/^[A-Za-z]+$/.test(firstNameRoman)) {
            throw new NameValidationError('名（ローマ字）は半角英字のみで入力してください')
          }
          data.firstNameRoman = firstNameRoman.charAt(0).toUpperCase() + firstNameRoman.slice(1).toLowerCase()
        }
        
        if (!req.user && req.payload && typeof req.payload.find === 'function') {
          try {
            const users = await req.payload.find({
              collection: 'users',
              limit: 1,
            })
            
            if (users.docs.length === 0) {
              data.role = 'admin'
            }
          } catch (error) {
            console.error('Error checking existing users:', error)
            data.role = 'admin'
          }
        } else if (!req.user) {
          data.role = 'admin'
        }
        
        return data
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeChange: [
      async ({ data, req }) => {
        if (!req.user) return data
        
        if (req.user.role === 'editor') {
          throw new Error('編集者はユーザー情報の変更は許可されていません')
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
