export type DeployStatus = {
  id: string
  status: 'pending' | 'building' | 'deploying' | 'success' | 'error'
  timestamp: string
  duration?: number
  error?: string
  buildUrl?: string
  logs?: string[]
}

declare global {
  // eslint-disable-next-line no-var
  var __DEPLOY_STATUS_STORE__: Map<string, DeployStatus> | undefined
  // eslint-disable-next-line no-var
  var __DEPLOY_SUBSCRIBERS__: Map<string, Set<(line: string) => void>> | undefined
}

export const deployStatuses: Map<string, DeployStatus> =
  globalThis.__DEPLOY_STATUS_STORE__ || (globalThis.__DEPLOY_STATUS_STORE__ = new Map<string, DeployStatus>())

export const deploySubscribers: Map<string, Set<(line: string) => void>> =
  globalThis.__DEPLOY_SUBSCRIBERS__ || (globalThis.__DEPLOY_SUBSCRIBERS__ = new Map<string, Set<(line: string) => void>>())

export function subscribeDeployLogs(deployId: string, cb: (line: string) => void) {
  if (!deploySubscribers.has(deployId)) deploySubscribers.set(deployId, new Set())
  deploySubscribers.get(deployId)!.add(cb)
  return () => {
    deploySubscribers.get(deployId)?.delete(cb)
  }
}

export function publishDeployLog(deployId: string, line: string) {
  const subs = deploySubscribers.get(deployId)
  if (subs && subs.size) {
    for (const fn of subs) {
      try { fn(line) } catch {}
    }
  }
}


