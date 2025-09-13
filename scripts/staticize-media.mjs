// Static export media bundler
// - Removes ?v=... cache params on /media/ URLs
// - Collects referenced /media/* files and copies/downloads them into the export dir

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
// no network fetching is performed; we rely solely on public/media

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXPORT_DIR = process.env.EXPORT_DIR || path.resolve(process.cwd(), 'out')
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

// no network probing; static bundling assumes files exist in public/media

/** Recursively list files in dir filtered by extensions */
async function listFiles(dir, exts) {
  const out = []
  async function walk(d) {
    let entries = []
    try {
      entries = await fs.readdir(d, { withFileTypes: true })
    } catch {
      return
    }
    for (const ent of entries) {
      const p = path.join(d, ent.name)
      if (ent.isDirectory()) {
        await walk(p)
      } else if (!exts || exts.has(path.extname(ent.name).toLowerCase())) {
        out.push(p)
      }
    }
  }
  await walk(dir)
  return out
}

function rewriteContent(s) {
  let out = s
  // Rewrite API media to static /media
  // Absolute URLs
  out = out.replace(/https?:\/\/[^"'`()\s]+\/api\/media\/file\//g, '/media/')
  out = out.replace(/https?:\/\/[^"'`()\s]+\/api\/media\//g, '/media/')
  // Relative URLs
  out = out.replace(/\b\/api\/media\/file\//g, '/media/')
  out = out.replace(/\b\/api\/media\//g, '/media/')
  // Escaped JSON strings (\/) -> unescaped /media
  out = out.replace(/https?:\\\/[^"]+\\\/api\\\/media\\\/file\\\//g, '/media/')
  out = out.replace(/https?:\\\/[^"]+\\\/api\\\/media\\\//g, '/media/')
  out = out.replace(/\\\/api\\\/media\\\/file\\\//g, '/media/')
  out = out.replace(/\\\/api\\\/media\\\//g, '/media/')
  // Drop cache param on media
  out = out.replace(/(\/media\/[^\s"'`()?]+)\?v=[^\s"'`()]+/g, '$1')
  return out
}

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true })
}

async function pathExists(p) {
  try { await fs.access(p); return true } catch { return false }
}

async function copyOrDownloadMedia(mediaPathRel, origin) {
  const targetPath = path.join(EXPORT_DIR, mediaPathRel)
  if (await pathExists(targetPath)) return 'exists'

  const sourcePublic = path.join(PUBLIC_DIR, mediaPathRel)
  await ensureDir(path.dirname(targetPath))

  if (await pathExists(sourcePublic)) {
    const buf = await fs.readFile(sourcePublic)
    await fs.writeFile(targetPath, buf)
    return 'copied'
  }

  if (!origin) return 'skipped:no-origin'

  const relNoLead = mediaPathRel.replace(/^\/+/, '')
  const baseName = path.basename(relNoLead)
  const urlPaths = [
    (o) => `${o}/${relNoLead}`,
  ]
  for (const build of urlPaths) {
    const url = build(origin)
    try {
      const res = await fetchWithTimeout(url, {}, 2500)
      if (res.ok) {
        const ab = await res.arrayBuffer()
        await fs.writeFile(targetPath, Buffer.from(ab))
        return 'downloaded'
      }
    } catch {}
  }
  return 'failed:fetch'
}

async function main() {
  console.log(`[staticize-media] exportDir=${EXPORT_DIR}`)
  // IMPORTANT: Do not rewrite JS bundles to avoid corrupting regex literals
  const textExts = new Set(['.html', '.json', '.css', '.txt', '.xml'])
  const files = await listFiles(EXPORT_DIR, textExts)

  let rewrote = 0

  for (const f of files) {
    const raw = await fs.readFile(f, 'utf8')
    const rewritten = rewriteContent(raw)
    if (rewritten !== raw) {
      await fs.writeFile(f, rewritten)
      rewrote++
    }

    // We don't collect references; we mirror entire public/media instead
  }

  console.log(`[staticize-media] rewrote files: ${rewrote}`)
  // Report any remaining /api/media occurrences
  let remaining = 0
  for (const f of files) {
    const s = await fs.readFile(f, 'utf8')
    if (/\b\/api\/media\//.test(s) || /\\\/api\\\/media\\\//.test(s)) remaining++
  }
  if (remaining > 0) {
    console.warn(`[staticize-media] WARNING: files still containing /api/media after rewrite: ${remaining}`)
  }

  // Ensure media directory exists
  await ensureDir(path.join(EXPORT_DIR, 'media'))

  // As a safety net for CSR-only references, copy all files from public/media into out/media
  const publicMediaDir = path.join(PUBLIC_DIR, 'media')
  if (await pathExists(publicMediaDir)) {
    const pubFiles = await listFiles(publicMediaDir)
    let mirrored = 0
    for (const abs of pubFiles) {
      const rel = path.relative(PUBLIC_DIR, abs) // e.g. media/xxx/yyy.png
      const dest = path.join(EXPORT_DIR, rel)
      await ensureDir(path.dirname(dest))
      try {
        await fs.copyFile(abs, dest)
        mirrored++
      } catch {
        // ignore
      }
    }
    console.log(`[staticize-media] mirrored all public/media files: ${mirrored}`)
  } else {
    console.log('[staticize-media] no public/media directory to mirror')
  }
}

main().catch((e) => {
  console.error('[staticize-media] error', e)
  process.exitCode = 1
})
