import { NextResponse } from 'next/server'
import { isLockActive, purgeStaleLock, readStatus, writeStatus } from '@/lib/deployFs'

export async function GET() {
  const status = await readStatus()
  const running = status.status === 'pending' || status.status === 'building' || status.status === 'deploying'
  const active = await isLockActive().catch(() => false)
  if (running && !active) {
    // self-heal: no active lock but status says running -> normalize to idle
    await purgeStaleLock().catch(() => {})
    await writeStatus({ status: 'idle', error: undefined })
    return NextResponse.json({ status: 'idle' })
  }
  return NextResponse.json(status)
}
