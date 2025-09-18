import type { Header } from '@/payload-types'

const normalizePath = (input: string): string => {
  const isAbsolute = /^https?:\/\//i.test(input)
  if (isAbsolute) {
    const url = new URL(input)
    const pathname = url.pathname.replace(/\/+$/, '')
    return pathname === '' ? '/' : pathname
  }
  const pathname = (`/${input}`).replace(/\/+$/, '').replace(/^\/+/, '/')
  return pathname === '' ? '/' : pathname
}

export const getHeaderTitleForPath = (args: {
  header: Header
  path: string
  fallback: string
}): string => {
  const { header, path, fallback } = args
  const navItems = header?.navItems || []
  const target = normalizePath(path)
  const matched = navItems.find((item: any) => {
    const url: string | undefined = item?.link?.url
    if (!url) return false
    return normalizePath(url) === target
  })
  return (matched as any)?.link?.label || fallback
}


