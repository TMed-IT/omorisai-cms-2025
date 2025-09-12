import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FloatIn, RevealText } from "@/components/Animations/animations";
import Link from "next/link";
import RichText from "@/components/RichText";
import { Media } from "@/components/Media";
import Image from "next/image";

// Static export settings for this dynamic route
export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const messages = await payload.find({
    collection: 'messages',
    draft: false,
    // Fetch all docs to generate every static route
    limit: 0,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return (messages.docs || [])
    .filter((doc: any) => Boolean(doc?.slug))
    .map((doc: any) => ({ slug: String(doc.slug) }))
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MessageDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  try {
    const messages = await payload.find({
      collection: "messages",
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!messages.docs.length) {
      notFound();
    }

    const message = messages.docs[0];

    if (!message) {
      notFound();
    }

    return (
      <section className="relative pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/message">
            <Button
              variant="outline"
              className="mb-8 border-slate-600 bg-transparent hover:bg-transparent transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              メッセージ一覧
            </Button>
          </Link>

          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden relative shadow-xl">
            <div className="relative flex items-center justify-center pt-12 pb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-blue-500/20 relative bg-slate-700 flex items-center justify-center shadow-md">
                {((message as any).avatar)
                  ? (
                    <Media
                      resource={(message as any).avatar}
                      fill
                      imgClassName="object-cover object-center"
                    />
                  )
                  : (
                    <Image
                      src="/icon-white.svg"
                      alt="avatar"
                      width={96}
                      height={96}
                      className="opacity-80"
                    />
                  )}
              </div>
            </div>

            <CardHeader className="pb-6">
              <RevealText>
                <CardTitle className="text-3xl md:text-4xl mb-2 text-center">
                  {message.name}
                </CardTitle>
              </RevealText>

              <FloatIn>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-200 border border-blue-500/30">
                    {message.position}
                  </span>
                </div>
              </FloatIn>
            </CardHeader>

            <div className="px-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>

            <CardContent className="space-y-8 pt-6">
              <FloatIn>
                <div>
                  <div className="text-white/80 leading-relaxed w-full prose prose-invert max-w-none">
                    <div className="transition-all duration-300 hover:text-white/90">
                      <RichText data={message.message} />
                    </div>
                  </div>
                </div>
              </FloatIn>
            </CardContent>

            <div className="px-6 pb-8">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6" />
              <div className="flex justify-center">
                <Link href="/message">
                  <Button
                    variant="secondary"
                    className="border border-slate-600 bg-slate-700 hover:bg-slate-600"
                  >
                    メッセージ一覧に戻る
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 hover:from-blue-500/3 hover:to-purple-500/3 transition-all duration-500 pointer-events-none" />
          </Card>
        </div>
      </section>
    );
  } catch (_error) {
    notFound();
  }
}

 
