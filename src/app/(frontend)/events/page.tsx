import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GridItem, StaggerGrid } from "@/components/Animations/animations";
import { WaveText } from "@/components/ui/wave-text";
import { Media } from "@/components/Media";
import Link from "next/link";
import { formatDateShortJP } from "@/utilities/formatDateTime";

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({ collection: "events" });

  const sortedEvents = events.docs.sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateA - dateB;
  });

  return (
    <div>
      <div className="container mx-auto text-center">
        <WaveText text="EVENTS" />
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StaggerGrid>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event: any, index: number) => (
                <GridItem key={event.id} index={index}>
                  <Card className="flex flex-col bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-full relative">
                    <div className="relative overflow-hidden">
                      <Media
                        resource={event.thumbnail}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-blue-300 transition-all duration-300">
                        {event.title}
                      </CardTitle>
                      <div className="text-white/70">
                        <p className="font-semibold transition-all duration-300 group-hover:text-white/90">
                          {event.location}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-white/80 mb-6 leading-relaxed flex-1 transition-all duration-300 group-hover:text-white/90">
                        {formatDateShortJP(new Date(event.date))}
                      </p>
                      <Link href={`/events/${event.slug}`} className="mt-auto">
                        <Button className="w-full bg-gradient-to-r text-white/90 from-blue-600 to-indigo-600">
                          詳細を見る
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none">
                    </div>
                  </Card>
                </GridItem>
              ))}
            </div>
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
