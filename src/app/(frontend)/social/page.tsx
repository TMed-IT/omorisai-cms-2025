import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'

import type { Festival } from '@/payload-types'

type SocialLink = NonNullable<Festival['socialLinks']>[0]

export default async function SocialPage() {
  const festivalData = await getCachedGlobal('festival', 1)() as Festival
  const socialLinks = festivalData?.socialLinks || []

  return (
    <div className="pt-16 pb-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16 animate-fade-in">
            SNS
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 animate-fade-in-delay">
            大森祭のSNSアカウントや最新の投稿をご覧いただけます。
          </p>
        </div>

        {socialLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {socialLinks.map((socialLink: SocialLink, index: number) => (
              <a
                key={index}
                href={socialLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  {socialLink.icon ? (
                    <div className="flex-shrink-0">
                      <Media 
                        resource={socialLink.icon} 
                        className="w-12 h-12 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">
                        {socialLink.label.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {socialLink.label}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      フォローする
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in-delay-2">
            <p className="text-gray-500 dark:text-gray-400">
              SNSリンクが設定されていません。管理画面でSNSリンクを追加してください。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}