import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAdminOnly = (args: AccessArgs<User>) => boolean

export const adminOnly: isAdminOnly = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
} 