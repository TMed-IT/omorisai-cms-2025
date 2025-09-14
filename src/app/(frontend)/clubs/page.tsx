import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridItem, StaggerGrid } from "@/components/Animations/animations";
import { WaveText } from "@/components/ui/wave-text";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import type { Club } from "@/payload-types";
import type { Metadata } from "next";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { generateMeta } from "@/utilities/generateMeta";

export async function generateMetadata(): Promise<Metadata> {
  const pageMetadataData = await getCachedGlobal("pageMetadata", 1)();
  const pageMetadata = (pageMetadataData as any)?.clubs;

  return generateMeta({
    staticPageMetadata: {
      title: pageMetadata?.title,
      description: pageMetadata?.description,
      ogImage: pageMetadata?.ogImage,
    },
  });
}

export default async function ClubPage() {
  const payload = await getPayload({ config: configPromise });
  const clubs = await payload.find({
    collection: "clubs",
    draft: false,
  });

  return (
    <div>
      <div className="container mx-auto text-center">
        <WaveText text="CLUBS" />
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StaggerGrid>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.docs.map((club: Club, index: number) => (
                <GridItem key={club.id} index={index}>
                  <Card className="flex flex-col bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-full relative">
                    <div className="relative overflow-hidden">
                      <Media
                        resource={club.image}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-blue-300 transition-all duration-300">
                        {club.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {club.description && (
                        <div className="text-white/80 leading-relaxed group-hover:text-white/90 transition-all duration-300">
                          <RichText
                            data={club.description as never}
                            enableGutter={false}
                          />
                        </div>
                      )}
                    </CardContent>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
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
