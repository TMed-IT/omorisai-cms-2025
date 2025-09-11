import { NextRequest } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { subscribeDeployLogs } from '@/lib/deployStore'

export async function GET(request: NextRequest, { params }: { params: Promise<{ deployId: string }> }) {
  const { user } = await getMeUser()
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return new Response('forbidden', { status: 403 })
  }

  const { deployId } = await params

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (line: string) => controller.enqueue(encoder.encode(`data: ${line}\n\n`))
      const unsubscribe = subscribeDeployLogs(deployId, send)
      // 初回メッセージ
      send(`[connected ${new Date().toISOString()}]`)
      controller.enqueue(encoder.encode(': keep-alive\n\n'))

      const keepAlive = setInterval(() => controller.enqueue(encoder.encode(': keep-alive\n\n')), 15000)
      const close = () => { clearInterval(keepAlive); unsubscribe(); controller.close() }
      // @ts-ignore
      request.signal?.addEventListener('abort', close)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}


