import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type OwnUserOrAdmin = (args: AccessArgs<User>) => boolean | object

export const ownUserOrAdmin: OwnUserOrAdmin = ({ req: { user } }) => {
  if (!user) return false
  
  if (user.role === 'admin') return true
  
  return {
    id: {
      equals: user.id,
    },
  }
} 