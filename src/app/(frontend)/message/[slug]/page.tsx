import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User } from 'lucide-react'
import { FloatIn, MorphIn, RevealText, ParallaxContainer } from '@/components/Animations/animations'
import Link from 'next/link'
import RichText from '@/components/RichText'

interface Props {
  params: {
    slug: string
  }
}

export default async function MessageDetailPage({ params }: Props) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const messages = await payload.find({
      collection: 'messages',
      where: {
        slug: {
          equals: params.slug,
        },
      },
    })

    if (!messages.docs.length) {
      notFound()
    }

    const message = messages.docs[0]

    if (!message) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"> 
        <ParallaxContainer offset={60}>
          <section className="relative pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <FloatIn delay={0.1}>
                <Link href="/message">
                  <Button variant="outline" className="mb-8 border-slate-600 text-white hover:bg-slate-700 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                    メッセージ一覧に戻る
                  </Button>
                </Link>
              </FloatIn>

              <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden relative">
                <div className="relative">
                  <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl text-white/30">
                      {message.name?.charAt(0) || '?'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                <CardHeader className="pb-8">
                  <RevealText delay={0.7}>
                    <CardTitle className="text-white text-3xl md:text-4xl mb-4">
                      {message.position} 挨拶
                    </CardTitle>
                  </RevealText>

                  <FloatIn delay={0.9}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden group">
                        <User className="w-8 h-8 text-white transition-all duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg transition-all duration-300 hover:text-blue-300">{message.name}</p>
                      </div>
                    </div>
                  </FloatIn>
                </CardHeader>

                <CardContent className="space-y-6">
                  <FloatIn delay={1.1}>
                    <div>
                      <div className="text-white/80 leading-relaxed w-full prose prose-invert max-w-none">
                        <div className="transition-all duration-300 hover:text-white/90">
                          <RichText data={message.message} />
                        </div>
                      </div>
                    </div>
                  </FloatIn>
                </CardContent>
                
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 hover:from-blue-500/3 hover:to-purple-500/3 transition-all duration-500 pointer-events-none"></div>
              </Card>
            </div>
          </section>
        </ParallaxContainer>
      </div>
    )
  } catch (error) {
    notFound()
  }
} 