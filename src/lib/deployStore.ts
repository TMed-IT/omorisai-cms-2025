export interface DeployStatus {
  id: string
  status: 'pending' | 'building' | 'deploying' | 'success' | 'error'
  timestamp: string
  logs: string[]
  error?: string
  buildUrl?: string
  duration?: number
}

export const deployStatuses = new Map<string, DeployStatus>()

export function publishDeployLog(deployId: string, log: string) {
  const status = deployStatuses.get(deployId)
  if (status) {
    status.logs.push(log)
    deployStatuses.set(deployId, status)
  }
}
