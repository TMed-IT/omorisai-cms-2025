import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { spawn } from 'child_process'
import path from 'path'
import {
  appendLog,
  clearLog,
  createLock,
  isLockActive,
  purgeStaleLock,
  readStatus,
  removeLock,
  writeStatus,
} from '@/lib/deployFs'

export async function POST(_request: NextRequest) {
  try {
    const { user } = await getMeUser()
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Admin privileges are required' }, { status: 403 })
    }

    // prevent duplicate run; purge stale lock first
    await purgeStaleLock().catch(() => {})
    if (await isLockActive()) {
      const status = await readStatus()
      return NextResponse.json({ message: 'Deployment already running', status }, { status: 409 })
    }

    const locked = await createLock()
    if (!locked) {
      const status = await readStatus()
      return NextResponse.json({ message: 'Deployment already running', status }, { status: 409 })
    }

    await clearLog()
    await writeStatus({ status: 'pending', error: undefined })
    await appendLog(`[start] ${new Date().toISOString()}\n`)

    const run = async () => {
      try {
        await writeStatus({ status: 'building' })
        const buildScript = path.join(process.cwd(), 'scripts', 'build-static.sh')
        const child1 = spawn('sh', [buildScript, 'shared'], { stdio: ['ignore', 'pipe', 'pipe'] })
        child1.stdout.on('data', (buf) => appendLog(buf.toString()))
        child1.stderr.on('data', (buf) => appendLog(buf.toString()))
        const code1: number = await new Promise((resolve, reject) => {
          child1.on('error', reject)
          child1.on('close', (code) => resolve(typeof code === 'number' ? code : 1))
        })
        if (code1 !== 0) throw new Error(`build failed with exit code ${code1}`)

        await writeStatus({ status: 'deploying' })
        const outDir = path.join(process.cwd(), 'out')
        const apiToken = process.env.CLOUDFLARE_API_TOKEN
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
        const projectName = process.env.CLOUDFLARE_PROJECT_NAME
        if (!apiToken || !accountId || !projectName) {
          throw new Error('Cloudflare env missing (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_PROJECT_NAME)')
        }
        const wranglerCmd = `npx --yes wrangler@3 pages deploy ${outDir} --project-name ${projectName}`
        await appendLog(`[wrangler] ${wranglerCmd}\n`)
        const child2 = spawn('sh', ['-lc', wranglerCmd], {
          stdio: ['ignore', 'pipe', 'pipe'],
          env: {
            ...process.env,
            CLOUDFLARE_API_TOKEN: apiToken,
            CLOUDFLARE_ACCOUNT_ID: accountId,
          },
        })
        child2.stdout.on('data', (buf) => appendLog(buf.toString()))
        child2.stderr.on('data', (buf) => appendLog(buf.toString()))
        const code2: number = await new Promise((resolve, reject) => {
          child2.on('error', reject)
          child2.on('close', (code) => resolve(typeof code === 'number' ? code : 1))
        })
        if (code2 !== 0) throw new Error(`wrangler failed with exit code ${code2}`)

        await writeStatus({ status: 'success' })
        await appendLog(`[done] ${new Date().toISOString()}\n`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('deploy pipeline error:', err)
        await writeStatus({ status: 'error', error: msg })
        await appendLog(`[error] ${msg}\n`)
      } finally {
        await removeLock()
      }
    }

    // fire and forget
    run().catch(() => {})

    return NextResponse.json({ message: 'Deployment started' }, { status: 202 })
  } catch (error) {
    console.error('Deployment start error:', error)
    return NextResponse.json({ error: 'Deployment start failed' }, { status: 500 })
  }
}
