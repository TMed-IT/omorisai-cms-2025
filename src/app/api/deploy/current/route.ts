import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'

interface CloudflareProject {
  id: string
  name: string
  subdomain: string
  domains: string[]
  canonical_deployment?: {
    id: string
    url: string
    environment: string
    created_on: string
    latest_stage: {
      name: string
      status: string
    }
    deployment_trigger: {
      type: string
      metadata: {
        branch?: string
        commit_hash?: string
        commit_message?: string
      }
    }
  }
  latest_deployment: {
    id: string
    url: string
    environment: string
    created_on: string
    latest_stage: {
      name: string
      status: string
    }
    deployment_trigger: {
      type: string
      metadata: {
        branch?: string
        commit_hash?: string
        commit_message?: string
      }
    }
  }
  production_deployment?: {
    id: string
    url: string
    environment: string
    created_on: string
    latest_stage: {
      name: string
      status: string
    }
    deployment_trigger: {
      type: string
      metadata: {
        branch?: string
        commit_hash?: string
        commit_message?: string
      }
    }
  }
}

interface CloudflareProjectResponse {
  result: CloudflareProject
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const projectName = process.env.CLOUDFLARE_PROJECT_NAME

    if (!apiToken || !accountId || !projectName) {
      return NextResponse.json(
        { error: 'Cloudflare環境変数が設定されていません' },
        { status: 500 }
      )
    }

    const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`

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
        { error: 'Cloudflare APIからのデータ取得に失敗しました' },
        { status: response.status }
      )
    }

    const data: CloudflareProjectResponse = await response.json()
    const project = data.result

    // 実際に公開されているデプロイメントを取得（canonical_deploymentが最優先）
    const activeDeployment = project.canonical_deployment || project.production_deployment || project.latest_deployment

    console.log('Cloudflare Project Data:', {
      projectName: project.name,
      hasCanonicalDeployment: !!project.canonical_deployment,
      hasProductionDeployment: !!project.production_deployment,
      hasLatestDeployment: !!project.latest_deployment,
      canonicalDeploymentId: project.canonical_deployment?.id,
      productionDeploymentId: project.production_deployment?.id,
      latestDeploymentId: project.latest_deployment?.id,
      selectedDeploymentId: activeDeployment?.id,
      selectedDeploymentStatus: activeDeployment?.latest_stage?.status,
    })

    if (!activeDeployment) {
      return NextResponse.json({
        currentDeployment: null,
        project: {
          name: project.name,
          subdomain: project.subdomain,
          domains: project.domains,
        }
      })
    }

    const currentDeployment = {
      id: activeDeployment.id,
      url: activeDeployment.url,
      environment: activeDeployment.environment,
      status: activeDeployment.latest_stage.status,
      stageName: activeDeployment.latest_stage.name,
      createdOn: activeDeployment.created_on,
      triggerType: activeDeployment.deployment_trigger.type,
      branch: activeDeployment.deployment_trigger.metadata.branch,
      commitHash: activeDeployment.deployment_trigger.metadata.commit_hash,
      commitMessage: activeDeployment.deployment_trigger.metadata.commit_message,
    }

    return NextResponse.json({
      currentDeployment,
      project: {
        name: project.name,
        subdomain: project.subdomain,
        domains: project.domains,
      }
    })

  } catch (error) {
    console.error('現在のデプロイメント取得エラー:', error)
    return NextResponse.json(
      { error: '現在のデプロイメントの取得に失敗しました' },
      { status: 500 }
    )
  }
}
