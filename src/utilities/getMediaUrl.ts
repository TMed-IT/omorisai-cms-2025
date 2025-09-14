import { getClientSideURL } from '@/utilities/getURL'
import { isStaticExport } from '@/utilities/isStaticExport'

// Safely append cache-busting parameter
function addCacheParam(u: string, cacheTag?: string | null) {
  if (!cacheTag) return u
  const sep = u.includes('?') ? '&' : '?'
  return `${u}${sep}v=${encodeURIComponent(cacheTag)}`
}

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const canonicalize = (u: string): string => {
    let out = u
    
    if (isStaticExport()) {
      // Static export時は /media/ をそのまま使用
      out = out.replace(/(^|https?:\/\/[^\s"'`]+)\/api\/media\/file\//g, (_m, p1) => `${p1 ? (p1 as string).replace(/\/$/, '') : ''}/media/`)
      out = out.replace(/(^|https?:\/\/[^\s"'`]+)\/api\/media\//g, (_m, p1) => `${p1 ? (p1 as string).replace(/\/$/, '') : ''}/media/`)
      // Static export時はキャッシュパラメータを削除
      out = out.replace(/(\/media\/[^\s"'`()?]+)\?v=[^\s"'`()]+/g, '$1')
    } else {
      // 本番環境ではAPI経由で取得（既にAPI経由の場合はそのまま）
      if (!/\/api\/media\//.test(out)) {
        out = out.replace(
          /(^|https?:\/\/[^\s"'`]+)\/media\//g,
          (_m, p1) => `${p1 ? (p1 as string).replace(/\/$/, '') : ''}/api/media/file/`,
        )
      }
    }
    
    return out
  }

  // Absolute URLs: if same-origin, convert to relative to avoid remote fetch
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const target = new URL(url)
      const base = getClientSideURL()
      if (base) {
        const baseURL = new URL(base)
        if (target.origin === baseURL.origin) {
          // keep path + search only
          const rel = `${target.pathname}${target.search || ''}`
          return addCacheParam(canonicalize(rel), cacheTag)
        }
      }
    } catch {}
    // different origin or parse failure: return as-is
    return addCacheParam(canonicalize(url), cacheTag)
  }

  // For same-origin resources, prefer relative path to avoid remote allowlist issues
  // e.g. '/media/...' or '/api/media/...'
  if (url.startsWith('/')) {
    return addCacheParam(canonicalize(url), cacheTag)
  }

  // Fallback: if a non-leading-slash path sneaks in, normalize to relative
  const normalized = `/${url.replace(/^\/+/, '')}`
  return addCacheParam(canonicalize(normalized), cacheTag)
}
