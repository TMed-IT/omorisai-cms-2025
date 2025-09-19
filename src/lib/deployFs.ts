import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'

const DEPLOY_DIR = path.join(process.cwd(), 'deploy')
const STATUS_FILE = path.join(DEPLOY_DIR, 'status.json')
const LOG_FILE = path.join(DEPLOY_DIR, 'deploy.log')
const LOCK_FILE = path.join(DEPLOY_DIR, 'lock.json')

type DeployStatus = {
  status: 'idle' | 'pending' | 'building' | 'deploying' | 'success' | 'error'
  startedAt?: string
  updatedAt?: string
  duration?: number
  error?: string
  buildUrl?: string
}

async function ensureDir() {
  await fsp.mkdir(DEPLOY_DIR, { recursive: true })
}

export async function readStatus(): Promise<DeployStatus> {
  try {
    const raw = await fsp.readFile(STATUS_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { status: 'idle' }
  }
}

export async function writeStatus(patch: Partial<DeployStatus>) {
  await ensureDir()
  const current = await readStatus()
  const now = new Date().toISOString()
  const next: DeployStatus = { ...current, ...patch, updatedAt: now }
  if (patch.status === 'pending' || patch.status === 'building' || patch.status === 'deploying') {
    if (!next.startedAt) next.startedAt = now
  }
  await fsp.writeFile(STATUS_FILE, JSON.stringify(next, null, 2))
}

export async function clearLog() {
  await ensureDir()
  await fsp.writeFile(LOG_FILE, '')
}

export async function appendLog(data: string) {
  await ensureDir()
  await fsp.appendFile(LOG_FILE, data)
}

export async function readLogTail(maxBytes = 128 * 1024): Promise<string> {
  try {
    const stat = await fsp.stat(LOG_FILE)
    const size = stat.size
    const start = size > maxBytes ? size - maxBytes : 0
    const fh = await fsp.open(LOG_FILE, 'r')
    try {
      const { buffer } = await fh.read({ position: start, length: size - start, buffer: Buffer.alloc(size - start) })
      return buffer.toString('utf8')
    } finally {
      await fh.close()
    }
  } catch {
    return ''
  }
}

export async function hasLock(): Promise<boolean> {
  try { await fsp.access(LOCK_FILE); return true } catch { return false }
}

export async function createLock(): Promise<boolean> {
  await ensureDir()
  if (await hasLock()) return false
  const payload = { startedAt: new Date().toISOString(), pid: process.pid }
  await fsp.writeFile(LOCK_FILE, JSON.stringify(payload, null, 2))
  return true
}

export async function removeLock() {
  try { await fsp.unlink(LOCK_FILE) } catch {}
}

export async function getLogFilePath(): Promise<string> {
  await ensureDir()
  return LOG_FILE
}

export async function readLock(): Promise<{ startedAt?: string, pid?: number } | null> {
  try {
    const raw = await fsp.readFile(LOCK_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isPidAlive(pid?: number): boolean {
  if (!pid || typeof pid !== 'number') return false
  try { process.kill(pid, 0); return true } catch { return false }
}

export async function isLockActive(maxMs = 60 * 60 * 1000): Promise<boolean> {
  const info = await readLock()
  if (!info?.startedAt) return false
  const started = Date.parse(info.startedAt)
  if (!Number.isFinite(started)) return false
  const age = Date.now() - started
  const alive = isPidAlive(info.pid)
  // Consider active only if within TTL and pid appears alive
  return (age >= 0 && age <= maxMs) && alive
}

export async function purgeStaleLock(maxMs = 60 * 60 * 1000): Promise<boolean> {
  if (!(await hasLock())) return false
  const active = await isLockActive(maxMs)
  if (active) return false
  await removeLock()
  return true
}
