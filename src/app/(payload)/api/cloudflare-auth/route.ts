import { NextRequest, NextResponse } from 'next/server'
import { verifyCloudflareJWT, getCloudflareJWTFromRequest } from '@/utilities/cloudflareAuth'

const createErrorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ error: message }, { status })
}

const createSuccessResponse = (data: any) => {
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const token = getCloudflareJWTFromRequest(req)
    if (!token) {
      return createErrorResponse('Cloudflare Access token not found', 401)
    }

    const cloudflarePayload = await verifyCloudflareJWT(token)
    if (!cloudflarePayload) {
      return createErrorResponse('Cloudflare Access token is invalid', 401)
    }

    const email = cloudflarePayload.email

    return createSuccessResponse({
      message: 'Authentication successful',
      email,
    })
  } catch (error) {
    console.error('Cloudflare authentication error:', error)
    return createErrorResponse('Authentication failed')
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getCloudflareJWTFromRequest(req)

    if (!token) {
      return createSuccessResponse({ authenticated: false })
    }

    const cloudflarePayload = await verifyCloudflareJWT(token)
    if (!cloudflarePayload) {
      return createSuccessResponse({ authenticated: false })
    }

    const email = cloudflarePayload.email
    
    return createSuccessResponse({ 
      authenticated: true,
      email,
    })
  } catch (error) {
    console.error('Cloudflare authentication check error:', error)
    return createSuccessResponse({ authenticated: false })
  }
}