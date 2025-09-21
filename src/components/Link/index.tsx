import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import { isStaticExport } from '@/utilities/isStaticExport'

import type { Page, Post, Message, Event, Club } from '@/payload-types'

type RelationMap = {
  pages: Page
  posts: Post
  messages: Message
  events: Event
  clubs: Club
}

type CMSLinkReference = ({
  [K in keyof RelationMap]: { relationTo: K; value: string | RelationMap[K] }
}[keyof RelationMap]) | null

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  // Match Payload's generated link types exactly for all relations used in content
  reference?: CMSLinkReference
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href = (() => {
    if (type !== 'reference' || !reference) return url
    const rel = reference.relationTo
    const val = reference.value
    if (rel === 'clubs') return '/clubs/'
    if (typeof val === 'object' && val) {
      if ('slug' in val && val.slug) {
        if (rel === 'pages') {
          return val.slug === 'home' ? '/' : `/${val.slug}/`
        }
        return `/${rel}/${val.slug}/`
      }
      if (rel === 'pages') return '/'
    }
    if (rel === 'pages') return '/'
    return `/${rel}/`
  })()

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    if (isStaticExport()) {
      return (
        <a className={cn(className)} href={href || url || ''} {...newTabProps}>
          {label && label}
          {children && children}
        </a>
      )
    }

    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      {isStaticExport() ? (
        <a className={cn(className)} href={href || url || ''} {...newTabProps}>
          {label && label}
          {children && children}
        </a>
      ) : (
        <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
          {label && label}
          {children && children}
        </Link>
      )}
    </Button>
  )
}
