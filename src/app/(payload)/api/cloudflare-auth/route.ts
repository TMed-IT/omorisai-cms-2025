import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyCloudflareJWT, extractUserInfoFromCloudflare, getCloudflareJWTFromRequest } from '@/utilities/cloudflareAuth'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const token = getCloudflareJWTFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { error: 'Cloudflare Accessトークンが見つかりません' },
        { status: 401 }
      )
    }

    const cloudflarePayload = await verifyCloudflareJWT(token)
    if (!cloudflarePayload) {
      return NextResponse.json(
        { error: 'Cloudflare Accessトークンが無効です' },
        { status: 401 }
      )
    }

    const userInfo = extractUserInfoFromCloudflare(cloudflarePayload)
    
    let user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userInfo.email,
        },
      },
      limit: 1,
    })

    if (user.docs.length === 0) {
      const userData = {
        ...userInfo,
        role: 'editor' as const,
        password: Math.random().toString(36),
      }

      const created = await payload.create({
        collection: 'users',
        data: userData,
      })

      user.docs = [created]
    }

    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: userInfo.email,
        password: user.docs[0]?.password || Math.random().toString(36),
      },
    })

    const response = NextResponse.json({
      message: 'Cloudflare Accessでログインしました',
      user: loginResult.user,
    })

    if (loginResult.token) {
      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Cloudflare認証エラー:', error)
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getCloudflareJWTFromRequest(req)
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const cloudflarePayload = await verifyCloudflareJWT(token)
    if (!cloudflarePayload) {
      return NextResponse.json({ authenticated: false })
    }

    const userInfo = extractUserInfoFromCloudflare(cloudflarePayload)
    return NextResponse.json({ 
      authenticated: true,
      user: userInfo,
    })
  } catch (error) {
    console.error('Cloudflare認証チェックエラー:', error)
    return NextResponse.json({ authenticated: false })
  }
}