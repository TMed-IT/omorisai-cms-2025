import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface CloudflareAccessPayload {
  email: string
  exp: number
  iat: number
  aud: string
  [key: string]: unknown
}

export interface CloudflareAccessConfig {
  teamDomain: string
  applicationAUD: string
  certificateURL: string
}

export const getCloudflareConfig = (): CloudflareAccessConfig => {
  const teamSubdomain = process.env.CLOUDFLARE_TEAM_DOMAIN
  const applicationAUD = process.env.CLOUDFLARE_APPLICATION_AUD

  if (!teamSubdomain || !applicationAUD) {
    throw new Error('Cloudflare Access environment variables are not set: CLOUDFLARE_TEAM_DOMAIN, CLOUDFLARE_APPLICATION_AUD')
  }

  const teamDomain = `https://${teamSubdomain}.cloudflareaccess.com`

  return {
    teamDomain,
    applicationAUD,
    certificateURL: `${teamDomain}/cdn-cgi/access/certs`,
  }
}

export const getCloudflareJWTFromRequest = (req: NextRequest): string | null => {
  const token = req.headers.get('cf-access-jwt-assertion') || req.cookies.get('CF_Authorization')?.value
  return token || null
}

export const verifyCloudflareJWT = async (token: string): Promise<CloudflareAccessPayload | null> => {
  try {
    const config = getCloudflareConfig()
    
    const certsResponse = await fetch(config.certificateURL)
    if (!certsResponse.ok) {
      return null
    }
    
    const certs = await certsResponse.json()
    const decoded = jwt.decode(token, { complete: true })
    
    if (!decoded?.header?.kid) {
      return null
    }
    
    const cert = certs.keys.find((key: any) => key.kid === decoded.header.kid)
    if (!cert?.n || !cert?.e) {
      return null
    }
    
    const payload = jwt.decode(token) as CloudflareAccessPayload
    if (!payload?.email) {
      return null
    }
    
    return payload
  } catch (error) {
    console.error('Cloudflare JWT verification error:', error)
    return null
  }
}

