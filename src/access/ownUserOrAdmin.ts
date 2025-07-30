import type { Access } from 'payload'

import type { User } from '@/payload-types'

export const ownUserOrAdmin: Access = ({ req: { user }, id }) => {
  if (!user) return false
  
  if (user.role === 'admin') return true
  
  return {
    id: {
      equals: user.id,
    },
  }
} 