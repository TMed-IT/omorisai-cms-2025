import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: 'Admin privileges are required' },
        { status: 403 }
      )
    }

    const { deploymentId } = await request.json()

    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Deployment ID is required' },
        { status: 400 }
      )
    }

    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const projectName = process.env.CLOUDFLARE_PROJECT_NAME

    if (!apiToken || !accountId || !projectName) {
      return NextResponse.json(
        { error: 'Cloudflare environment variables are not set' },
        { status: 500 }
      )
    }

    const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}/rollback`

    console.log('Rollback API Request:', {
      url: cloudflareUrl,
      deploymentId,
      projectName,
      accountId: accountId.substring(0, 8) + '...'
    })

    const response = await fetch(cloudflareUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cloudflare rollback API error:', response.status, errorText)
      
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'This deployment cannot be rolled back' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Rollback failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Rollback started',
      newDeploymentId: data.result?.id,
    })

  } catch (error) {
    console.error('Rollback error:', error)
    return NextResponse.json(
      { error: 'Rollback execution failed' },
      { status: 500 }
    )
  }
}
