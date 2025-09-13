import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.__NEXT_PRIVATE_ORIGIN

/** @type {import('next').NextConfig} */
const nextConfig = {
  // trailingSlash helps produce directory-style static paths when exporting
  trailingSlash: true,
  // Produce a self-contained server build for Docker deployments
  output: 'standalone',
  i18n: {
    locales: ['ja'],
    defaultLocale: 'ja',
  },
  images: {
    // Keep image optimization disabled for static exports
    unoptimized: true,
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
