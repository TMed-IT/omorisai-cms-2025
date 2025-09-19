import { NextRequest } from 'next/server'
import { getLogFilePath, readLogTail } from '@/lib/deployFs'
import fs from 'fs'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (line: string) => controller.enqueue(encoder.encode(`data: ${line}\n\n`))
      // initial tail
      const initial = await readLogTail(128 * 1024)
      if (initial) {
        for (const line of initial.split(/\r?\n/)) send(line)
      }
      // polling-based tail for robustness
      const logPath = await getLogFilePath()
      let lastSize = 0
      try {
        const stat = fs.statSync(logPath)
        lastSize = stat.size
      } catch {}
      const timer = setInterval(() => {
        try {
          const stat = fs.statSync(logPath)
          if (stat.size > lastSize) {
            const fd = fs.openSync(logPath, 'r')
            try {
              const len = stat.size - lastSize
              const buf = Buffer.alloc(len)
              fs.readSync(fd, buf, 0, len, lastSize)
              lastSize = stat.size
              const delta = buf.toString('utf8')
              for (const line of delta.split(/\r?\n/)) send(line)
            } finally {
              fs.closeSync(fd)
            }
          }
        } catch {
          // ignore
        }
      }, 1000)

      // keep-alive
      const keep = setInterval(() => controller.enqueue(encoder.encode(': keep-alive\n\n')), 15000)

      // abort handling
      // @ts-ignore
      request.signal?.addEventListener('abort', () => {
        clearInterval(timer)
        clearInterval(keep)
        controller.close()
      })
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

