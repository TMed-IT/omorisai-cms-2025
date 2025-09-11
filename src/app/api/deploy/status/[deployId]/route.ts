import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { deployStatuses } from '@/lib/deployStore'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deployId: string }> }
) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const { deployId } = await params
    const status = deployStatuses.get(deployId)
    
    if (!status) {
      return NextResponse.json(
        { error: 'デプロイが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(status)

  } catch (error) {
    console.error('ステータス取得エラー:', error)
    return NextResponse.json(
      { error: 'ステータスの取得に失敗しました' },
      { status: 500 }
    )
  }
}