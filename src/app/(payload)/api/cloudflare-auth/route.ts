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
    
    const user = await payload.find({
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

      await payload.create({
        collection: 'users',
        data: userData,
      })
    }

    return NextResponse.json({
      message: 'ユーザー情報を取得しました',
      user: userInfo,
    })
  } catch (error) {
    console.error('Cloudflare認証エラー:', error)
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました' },
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