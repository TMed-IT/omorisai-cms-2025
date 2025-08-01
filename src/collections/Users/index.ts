import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { canAccessAdminPanel } from '@/access/canAccessAdminPanel'
import { validateEmail } from '@/utilities/validateEmail'
import { EmailValidationError, NameValidationError, EditorCannotEditUserDataError } from '@/utilities/errors'

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
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
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
    defaultColumns: ['name', 'nameRoman', 'email', 'role'],
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
        description: '管理者は全ての機能にアクセスでき、編集者はユーザー管理以外の機能にアクセスできます',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: '名前',
      required: true,
      admin: {
        description: '姓名の間は半角スペースで区切ってください',
      },
    },
    {
      name: 'nameRoman',
      type: 'text',
      label: '名前（ローマ字）',
      required: true,
      admin: {
        description: '姓名（ローマ字）の間は半角スペースで区切ってください',
      },
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
        
        if (data?.name) {
          const name = data.name as string
          if (!name.trim()) {
            throw new NameValidationError('名前を入力してください')
          }
          
          if (!name.includes(' ')) {
            throw new NameValidationError('姓名の間は半角スペースで区切ってください')
          }
        }
        
        if (data?.nameRoman) {
          const nameRoman = data.nameRoman as string
          if (!nameRoman.trim()) {
            throw new NameValidationError('名前（ローマ字）を入力してください')
          }
          
          const nameRomanParts = nameRoman.trim().split(' ')

          const lastNameRoman = nameRomanParts[0]
          const firstNameRoman = nameRomanParts[1]

          if (!lastNameRoman || !firstNameRoman) {
            throw new NameValidationError('姓名（ローマ字）の間は半角スペースで区切ってください')
          }

          if (!/^[A-Za-z]+$/.test(lastNameRoman) || !/^[A-Za-z]+$/.test(firstNameRoman)) {
            throw new NameValidationError('名前（ローマ字）は半角英字のみで入力してください')
          }
          
          data.nameRoman = `${lastNameRoman.charAt(0).toUpperCase()}${lastNameRoman.slice(1).toLowerCase()} ${firstNameRoman.charAt(0).toUpperCase()}${firstNameRoman.slice(1).toLowerCase()}`
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
    beforeChange: [
      async ({ data, req }) => {
        if (!req.user) return data
        
        if (req.user.role === 'editor') {
          throw new EditorCannotEditUserDataError()
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
