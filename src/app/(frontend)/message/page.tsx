import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { FadeIn, Stagger, StaggerItem } from '@/components/Animations/animations'
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
    // スケルトン表示
    return (
      <div className="w-full h-6 bg-slate-700 rounded animate-pulse mb-2" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">

      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-white mb-6">MESSAGES</h1>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Stagger>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedMessages.map((message: any, index: number) => (
                <StaggerItem key={message.id}>
                  <Card className="flex flex-col bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-300 ease-in-out hover:scale-[1.04] active:scale-100 hover:shadow-2xl hover:border-blue-400 h-full">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:opacity-80">
                        <div className="text-6xl text-white/30">
                          {message.name?.charAt(0) || '?'}
                        </div>
                      </div>

                    </div>
                    <CardHeader>
                      <CardTitle className="text-white text-xl group-hover:text-blue-300 transition-colors">
                        {message.position} 挨拶
                      </CardTitle>
                      <div className="text-white/70">
                        <p className="font-semibold">{message.name}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-white/80 mb-6 leading-relaxed flex-1">
                        {getExcerpt(message)}
                      </p>
                      <Link href={`/message/${message.slug}`} className="mt-auto">
                        <Button className="w-full bg-gradient-to-r text-white/90 from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:scale-105 transition-all duration-300">
                          続きを読む
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </section>
    </div>
  )
}