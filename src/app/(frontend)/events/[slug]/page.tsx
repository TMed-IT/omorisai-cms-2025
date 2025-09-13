import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { FloatIn, RevealText } from "@/components/Animations/animations";
import Link from "next/link";
import { Media } from "@/components/Media";
import { formatDateShortJP } from "@/utilities/formatDateTime";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  try {
    const events = await payload.find({
      collection: "events",
      draft: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!events.docs.length) {
      notFound();
    }

    const event = events.docs[0];

    if (!event) {
      notFound();
    }

    return (
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/events">
            <Button
              variant="outline"
              className="mb-8 border-slate-600 bg-transparent hover:bg-transparent transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              イベント一覧
            </Button>
          </Link>

          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden relative">
            <div className="relative">
              <div className="w-full h-64 md:h-80 flex items-center justify-center relative overflow-hidden">
                <Media
                  resource={event.thumbnail}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5">
                </div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse">
                </div>
                <div
                  className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                >
                </div>
              </div>
            </div>

            <CardHeader className="pb-8">
              <RevealText>
                <CardTitle className="text-3xl md:text-4xl mb-4">
                  {event.title}
                </CardTitle>
              </RevealText>
              <FloatIn>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDateShortJP(new Date(event.date))}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </FloatIn>
            </CardHeader>

            <CardContent className="space-y-6">
              <FloatIn>
                <div>
                  {/* 詳細説明フィールドがないため本文は非表示 */}
                </div>
              </FloatIn>
            </CardContent>

            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 hover:from-blue-500/3 hover:to-purple-500/3 transition-all duration-500 pointer-events-none">
            </div>
          </Card>
        </div>
      </section>
    );
  } catch (_error) {
    notFound();
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({
    collection: "events",
    draft: false,
    limit: 0,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  });

  return events.docs
    .filter((doc: any) => Boolean(doc?.slug))
    .map((doc: any) => ({ slug: doc.slug as string }));
}

export const dynamic = "force-static";
export const revalidate = 600;
export const dynamicParams = false;
