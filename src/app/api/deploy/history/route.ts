import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { deployStatuses } from '@/lib/deployStore'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const allDeploys = Array.from(deployStatuses.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json(allDeploys)

  } catch (error) {
    console.error('履歴取得エラー:', error)
    return NextResponse.json(
      { error: 'デプロイ履歴の取得に失敗しました' },
      { status: 500 }
    )
  }
}
