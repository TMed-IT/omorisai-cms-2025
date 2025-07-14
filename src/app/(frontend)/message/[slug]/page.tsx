import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User } from 'lucide-react'
import { FadeIn, ScaleIn } from '@/components/Animations/animations'
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
        <section className="relative pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <FadeIn>
              <Link href="/message">
                <Button variant="outline" className="mb-8 border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  メッセージ一覧に戻る
                </Button>
              </Link>
            </FadeIn>

            <ScaleIn>
              <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                    <div className="text-6xl text-white/30">
                      {message.name?.charAt(0) || '?'}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-8">
                  <CardTitle className="text-white text-3xl md:text-4xl mb-4">
                    {message.position} 挨拶
                  </CardTitle>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{message.name}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <div className="text-white/80 leading-relaxed w-full">
                      <RichText data={message.message} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScaleIn>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    notFound()
  }
} 