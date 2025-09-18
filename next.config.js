import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.__NEXT_PRIVATE_ORIGIN
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'standalone',
  ...(isStaticExport
    ? {}
    : {
        i18n: {
          locales: ['ja'],
          defaultLocale: 'ja',
        },
      }),
  images: {
    unoptimized: isStaticExport,
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
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
