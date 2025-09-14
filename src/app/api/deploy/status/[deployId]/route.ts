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
        { error: 'Admin privileges are required' },
        { status: 403 }
      )
    }

    const { deployId } = await params
    const status = deployStatuses.get(deployId)
    
    if (!status) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(status)

  } catch (error) {
    console.error('Status get error:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
}