import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'
type CanAccessAdminPanel = (args: AccessArgs<User>) => boolean
export const canAccessAdminPanel: CanAccessAdminPanel = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}