import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'

import type { Festival } from '@/payload-types'
import { FadeIn, Stagger, StaggerItem } from '@/components/Animations/animations'
import { WaveText } from '@/components/ui/wave-text'

type SocialLink = NonNullable<Festival['socialLinks']>[0]

export default async function SocialPage() {
  const festivalData = await getCachedGlobal('festival', 1)() as Festival
  const socialLinks = festivalData?.socialLinks || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <WaveText 
                text="SNS" 
                delay={0.4}
                className="text-6xl font-bold text-white mb-6"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-white mb-12">SNSリンク</h2>
          </FadeIn>

          {socialLinks.length > 0 ? (
            <Stagger>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {socialLinks.map((socialLink: SocialLink, index: number) => (
                  <StaggerItem key={index}>
                    <a
                      href={socialLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
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
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          ) : (
            <div className="text-center py-12 animate-fade-in-delay-2">
              <p className="text-gray-500 dark:text-gray-400">
                SNSリンクが設定されていません。管理画面でSNSリンクを追加してください。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}