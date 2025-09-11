import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { exec } from 'child_process'
import { promisify } from 'util'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import { deployStatuses, type DeployStatus, publishDeployLog } from '@/lib/deployStore'

const execAsync = promisify(exec)

 

export async function POST(request: NextRequest) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const deployId = uuidv4()
    const timestamp = new Date().toISOString()
    
    const deployStatus: DeployStatus = {
      id: deployId,
      status: 'pending',
      timestamp,
      logs: []
    }
    
    deployStatuses.set(deployId, deployStatus)

    const buildAndDeploy = async () => {
      try {
        deployStatuses.set(deployId, { ...deployStatus, status: 'building' })
        
        const buildScript = path.join(process.cwd(), 'scripts', 'build-static.sh')
        
        const child = exec(`sh ${buildScript} ${deployId}`)
        const logs: string[] = [`ビルド開始: ${timestamp}`]
        child.stdout?.on('data', (chunk) => {
          const line = chunk.toString()
          logs.push(line)
          publishDeployLog(deployId, line)
        })
        child.stderr?.on('data', (chunk) => {
          const line = chunk.toString()
          logs.push(line)
          publishDeployLog(deployId, line)
        })
        await new Promise<void>((resolve, reject) => {
          child.on('error', reject)
          child.on('close', () => resolve())
        })
        
        deployStatuses.set(deployId, { 
          ...deployStatus, 
          status: 'deploying',
          logs
        })

        await deployToCloudflare(deployId)
        
      } catch (error) {
        console.error('ビルドエラー:', error)
        deployStatuses.set(deployId, { 
          ...deployStatus, 
          status: 'error',
          error: error instanceof Error ? error.message : '不明なエラーが発生しました',
          logs: [...(deployStatus.logs || []), `エラー: ${error}`]
        })
      }
    }

    buildAndDeploy()

    return NextResponse.json({ 
      deployId,
      message: 'デプロイプロセスを開始しました' 
    })

  } catch (error) {
    console.error('デプロイ開始エラー:', error)
    return NextResponse.json(
      { error: 'デプロイの開始に失敗しました' },
      { status: 500 }
    )
  }
}

async function deployToCloudflare(deployId: string) {
  try {
    const deployStatus = deployStatuses.get(deployId)
    if (!deployStatus) return

    const outDir = path.join(process.cwd(), 'out')
    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const projectName = process.env.CLOUDFLARE_PROJECT_NAME

    if (!apiToken || !accountId || !projectName) {
      throw new Error('Cloudflare環境変数が不足しています (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_PROJECT_NAME)')
    }

    const wranglerCmd = `npx --yes wrangler@3 pages deploy ${outDir} --project-name ${projectName} --branch main --commit-hash ${deployId}`

    publishDeployLog(deployId, `[wrangler] ${wranglerCmd}`)
    await new Promise<void>((resolve, reject) => {
      const child = exec(wranglerCmd, {
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN: apiToken,
          CLOUDFLARE_ACCOUNT_ID: accountId,
        },
      })
      child.stdout?.on('data', (chunk) => publishDeployLog(deployId, chunk.toString()))
      child.stderr?.on('data', (chunk) => publishDeployLog(deployId, chunk.toString()))
      child.on('error', reject)
      child.on('close', () => resolve())
    })
    // wranglerの出力からURLを拾うこともできるが、ここでは成功時に履歴のみ更新
    
    deployStatuses.set(deployId, {
      ...deployStatus,
      status: 'success',
      buildUrl: deployStatus.buildUrl,
      duration: Math.floor((Date.now() - new Date(deployStatus.timestamp).getTime()) / 1000),
      logs: [...(deployStatus.logs || []), `デプロイ完了`]
    })

  } catch (error) {
    console.error('Cloudflareデプロイエラー:', error)
    deployStatuses.set(deployId, {
      ...deployStatuses.get(deployId)!,
      status: 'error',
      error: error instanceof Error ? error.message : 'Cloudflareデプロイに失敗しました',
      logs: [...(deployStatuses.get(deployId)?.logs || []), `デプロイエラー: ${error}`]
    })
  }
}

// not used with wrangler upload
