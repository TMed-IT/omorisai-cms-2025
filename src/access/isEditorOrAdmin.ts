import type { Access } from 'payload'
import type { User } from '@/payload-types'
export const isEditorOrAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}