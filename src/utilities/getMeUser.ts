import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import type { User } from '../payload-types'
import { isStaticExport } from './isStaticExport'
import config from '../payload.config'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  // On static export, there is no API runtime; avoid calling /api/users/me
  if (isStaticExport()) {
    if (nullUserRedirect) redirect(nullUserRedirect)
    // Return safe placeholders; in static export these code paths should not be used by API routes
    return {
      token: '',
      // @ts-expect-error – not available during static export
      user: undefined,
    }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    if (nullUserRedirect) redirect(nullUserRedirect)
    throw new Error('Authentication token not found')
  }

  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  
  try {
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      if (nullUserRedirect) redirect(nullUserRedirect)
      throw new Error('User not found')
    }

    if (validUserRedirect && user) {
      redirect(validUserRedirect)
    }

    return {
      token: token,
      user,
    }
  } catch (error) {
    if (nullUserRedirect) redirect(nullUserRedirect)
    throw error
  }
}
