import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface CloudflareAccessPayload {
  aud: string
  email: string
  exp: number
  iat: number
  sub: string
  common_name?: string
  custom?: {
    [key: string]: any
  }
}

export interface CloudflareAccessConfig {
  teamDomain: string
  applicationAUD: string
  certificateURL?: string
}

export const getCloudflareConfig = (): CloudflareAccessConfig => {
  const teamDomain = process.env.CLOUDFLARE_TEAM_DOMAIN
  const applicationAUD = process.env.CLOUDFLARE_APPLICATION_AUD

  if (!teamDomain || !applicationAUD) {
    throw new Error('Cloudflare Access環境変数が設定されていません')
  }

  return {
    teamDomain,
    applicationAUD,
    certificateURL: `https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`,
  }
}

export const getCloudflareJWTFromRequest = (req: NextRequest): string | null => {
  const token = req.headers.get('cf-access-jwt-assertion') || 
                req.cookies.get('CF_Authorization')?.value ||
                req.headers.get('authorization')?.replace('Bearer ', '')

  return token || null
}

export const verifyCloudflareJWT = async (token: string): Promise<CloudflareAccessPayload | null> => {
  try {
    const config = getCloudflareConfig()
    
    const certsResponse = await fetch(config.certificateURL!)
    const certs = await certsResponse.json()
    
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || !decoded.header.kid) {
      return null
    }

    const cert = certs.keys.find((key: any) => key.kid === decoded.header.kid)
    if (!cert) {
      return null
    }

    const publicKey = `-----BEGIN CERTIFICATE-----\n${cert.x5c[0]}\n-----END CERTIFICATE-----`

    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: config.applicationAUD,
    }) as CloudflareAccessPayload

    return payload
  } catch (error) {
    console.error('Cloudflare JWT検証エラー:', error)
    return null
  }
}

export const extractUserInfoFromCloudflare = (payload: CloudflareAccessPayload) => {
  const email = payload.email
  const name = payload.common_name || email.split('@')[0] || ''
  
  const [firstName, lastName] = name.includes(' ') 
    ? name.split(' ', 2) 
    : [name, '']

  return {
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    id: email.split('@')[0],
  }
}