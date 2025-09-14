import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import type { CloudflareDeploymentsResponse, FormattedDeployment, DeploymentHistoryResponse } from '@/types/cloudflare'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: 'Admin privileges are required' },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }

  try {

    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const projectName = process.env.CLOUDFLARE_PROJECT_NAME

    if (!apiToken || !accountId || !projectName) {
      return NextResponse.json(
        { error: 'Cloudflare environment variables are not set' },
        { status: 500 }
      )
    }

    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '1'
    const perPage = url.searchParams.get('per_page') || '10'

    const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?page=${page}&per_page=${perPage}`

    const response = await fetch(cloudflareUrl, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cloudflare API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to get data from Cloudflare API' },
        { status: response.status }
      )
    }

    const data: CloudflareDeploymentsResponse = await response.json()

    const formattedDeployments = data.result.map(deployment => ({
      id: deployment.id,
      url: deployment.url,
      environment: deployment.environment,
      status: deployment.latest_stage.status,
      createdOn: deployment.created_on,
      modifiedOn: deployment.modified_on,
      startedOn: deployment.latest_stage.started_on,
      endedOn: deployment.latest_stage.ended_on,
      stageName: deployment.latest_stage.name,
      triggerType: deployment.deployment_trigger.type,
      branch: deployment.deployment_trigger.metadata.branch,
      commitHash: deployment.deployment_trigger.metadata.commit_hash,
      commitMessage: deployment.deployment_trigger.metadata.commit_message,
    }))

    return NextResponse.json({
      deployments: formattedDeployments,
      pagination: data.result_info,
    })

  } catch (error) {
    console.error('Deployment history error:', error)
    return NextResponse.json(
      { error: 'Failed to get deployment history' },
      { status: 500 }
    )
  }
}
