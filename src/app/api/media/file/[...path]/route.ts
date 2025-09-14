import { NextRequest } from 'next/server'
import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

// Root directory for media files within the Next.js app
const MEDIA_ROOT = path.resolve(process.cwd(), 'public', 'media')

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    case '.avif':
      return 'image/avif'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params

  if (!Array.isArray(parts) || parts.length === 0) {
    return new Response('Not Found', { status: 404 })
  }

  // Build absolute path and prevent path traversal
  const rel = parts.join('/')
  const absPath = path.resolve(MEDIA_ROOT, rel)
  if (!absPath.startsWith(MEDIA_ROOT + path.sep)) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const stat = await fs.stat(absPath)
    if (!stat.isFile()) {
      return new Response('Not Found', { status: 404 })
    }

    const contentType = getContentType(absPath)

    // Choose cache policy: long cache if version param provided, otherwise no-store
    const url = new URL(request.url)
    const hasVersion = url.searchParams.has('v')
    const cacheControl = hasVersion
      ? 'public, max-age=31536000, immutable'
      : 'no-store'

    // Stream the file
    const stream = createReadStream(absPath)
    return new Response(stream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': cacheControl,
      },
    })
  } catch (e: any) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) {
      return new Response('Not Found', { status: 404 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}

