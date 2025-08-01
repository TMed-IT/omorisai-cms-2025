import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type IsEditorOrAdmin = (args: AccessArgs<User>) => boolean

export const isEditorOrAdmin: IsEditorOrAdmin = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}