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
    return 'メッセージを読み込んでいます...'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">

      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-white mb-6">MESSAGES</h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                大森祭実行委員長をはじめ、学長、教職員、地域の皆様からの
                <br />
                温かい応援メッセージをお届けします。
              </p>
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
                  <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group hover:scale-105 hover:bg-slate-700/90 transition-all duration-300 h-full">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
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
                      <Link href={`/message/${message.slug}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:scale-105 transition-all duration-300">
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