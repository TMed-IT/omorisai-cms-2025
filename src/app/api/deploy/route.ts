import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { exec } from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import { deployStatuses, type DeployStatus, publishDeployLog } from '@/lib/deployStore'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getMeUser()
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json(
        { error: 'Admin privileges are required' },
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
        const logs: string[] = [`Build started: ${timestamp}`]
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
          child.on('close', (code) => {
            if (typeof code === 'number' && code !== 0) {
              return reject(new Error(`build failed with exit code ${code}`))
            }
            resolve()
          })
        })
        
        deployStatuses.set(deployId, { 
          ...deployStatus, 
          status: 'deploying',
          logs
        })

        await deployToCloudflare(deployId)
        
      } catch (error) {
        console.error('Build error:', error)
        deployStatuses.set(deployId, { 
          ...deployStatus, 
          status: 'error',
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          logs: [...(deployStatus.logs || []), `エラー: ${error}`]
        })
      }
    }

    buildAndDeploy()

    return NextResponse.json({ 
      deployId,
      message: 'Deployment process started' 
    })

  } catch (error) {
    console.error('Deployment start error:', error)
    return NextResponse.json(
      { error: 'Deployment start failed' },
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
      throw new Error('Cloudflare environment variables are missing (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_PROJECT_NAME)')
    }

    // sanity check: ensure some HTML files exist before deploying
    async function hasHtmlFiles(dir: string): Promise<boolean> {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const e of entries) {
        const full = path.join(dir, e.name)
        if (e.isFile() && e.name.endsWith('.html')) return true
        if (e.isDirectory()) {
          if (await hasHtmlFiles(full)) return true
        }
      }
      return false
    }

    if (!(await hasHtmlFiles(outDir))) {
      throw new Error('HTML files not found in out directory. The build result may be empty.')
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
    
    deployStatuses.set(deployId, {
      ...deployStatus,
      status: 'success',
      buildUrl: deployStatus.buildUrl,
      duration: Math.floor((Date.now() - new Date(deployStatus.timestamp).getTime()) / 1000),
      logs: [...(deployStatus.logs || []), `Deployment completed`]
    })

  } catch (error) {
    console.error('Cloudflare deployment error:', error)
    deployStatuses.set(deployId, {
      ...deployStatuses.get(deployId)!,
      status: 'error',
      error: error instanceof Error ? error.message : 'Cloudflare deployment failed',
      logs: [...(deployStatuses.get(deployId)?.logs || []), `Deployment error: ${error}`]
    })
  }
}
