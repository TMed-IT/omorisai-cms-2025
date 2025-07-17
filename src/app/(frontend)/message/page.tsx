import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { FloatIn, StaggerGrid, GridItem, ParallaxContainer } from '@/components/Animations/animations'
import { WaveText } from '@/components/ui/wave-text'
import Link from 'next/link'

export default async function MessagePage() {
  const payload = await getPayload({ config: configPromise })
  const messages = await payload.find({ collection: 'messages' })
  
  const sortedMessages = messages.docs.sort((a: any, b: any) => {
    const slugA = parseInt(a.slug) || 0
    const slugB = parseInt(b.slug) || 0
    return slugA - slugB
  })

  const getExcerpt = (message: any) => {
    if (message.message?.root?.children?.[0]?.children?.[0]?.text) {
      const text = message.message.root.children[0].children[0].text
      return text.length > 100 ? text.substring(0, 100) + '...' : text
    }
    return (
      <div className="w-full h-6 bg-slate-700 rounded animate-pulse mb-2" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <ParallaxContainer offset={80}>
        <section className="relative pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <FloatIn>
              <div className="text-center mb-12">
                <WaveText 
                  text="MESSAGES" 
                  delay={0.4}
                  className="text-6xl font-bold text-white mb-6"
                />
              </div>
            </FloatIn>
          </div>
        </section>
      </ParallaxContainer>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StaggerGrid staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedMessages.map((message: any, index: number) => (
                <GridItem key={message.id} index={index}>
                  <Card className="flex flex-col bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-full relative">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:opacity-80 relative">
                        <div className="text-6xl text-white/30">
                          {message.name?.charAt(0) || '?'}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-white text-xl group-hover:text-blue-300 transition-all duration-300">
                        {message.position} 挨拶
                      </CardTitle>
                      <div className="text-white/70">
                        <p className="font-semibold transition-all duration-300 group-hover:text-white/90">{message.name}</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-white/80 mb-6 leading-relaxed flex-1 transition-all duration-300 group-hover:text-white/90">
                        {getExcerpt(message)}
                      </p>
                      <Link href={`/message/${message.slug}`} className="mt-auto">
                        <Button className="w-full bg-gradient-to-r text-white/90 from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                          続きを読む
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                    
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>
                  </Card>
                </GridItem>
              ))}
            </div>
          </StaggerGrid>
        </div>
      </section>
    </div>
  )
}