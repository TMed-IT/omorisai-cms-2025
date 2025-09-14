import configPromise from "@payload-config";
import { getPayload } from "payload";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GridItem, StaggerGrid } from "@/components/Animations/animations";
import { WaveText } from "@/components/ui/wave-text";
import Link from "next/link";
import type { Message } from "@/payload-types";
import { Media } from "@/components/Media";
import Image from "next/image";
import { Metadata } from "next";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { generateMeta } from "@/utilities/generateMeta";

export async function generateMetadata(): Promise<Metadata> {
  const festivalData = await getCachedGlobal("festival", 1)();
  const pageMetadata = (festivalData as any)?.pageMetadata?.message;

  return generateMeta({
    staticPageMetadata: {
      title: pageMetadata?.title,
      description: pageMetadata?.description,
      ogImage: pageMetadata?.ogImage,
    },
  });
}

export default async function MessagePage() {
  const payload = await getPayload({ config: configPromise });
  const messages = await payload.find({
    collection: "messages",
    draft: false,
    limit: 0,
    overrideAccess: false,
    pagination: false,
    sort: "order",
  });

  const getExcerpt = (message: Message) => {
    const paragraphNode = message.message?.root?.children?.find((
      node: unknown,
    ) => (node as { type: string }).type === "paragraph");
    if (paragraphNode && Array.isArray(paragraphNode.children)) {
      const text = paragraphNode.children.map((child: unknown) =>
        (child as { text?: string }).text || ""
      )
        .join("");
      const firstLine = text.split(/\r?\n/)[0];
      if (firstLine) {
        return firstLine.length > 100
          ? firstLine.substring(0, 100) + "..."
          : firstLine;
      }
    }
    return (
      <div className="w-full h-6 bg-slate-700 rounded animate-pulse mb-2" />
    );
  };

  return (
    <div>
      <div className="container mx-auto text-center">
        <WaveText text="MESSAGES" />
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StaggerGrid>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {messages.docs.map((message: Message, index: number) => (
                <GridItem key={message.id} index={index}>
                  <Card className="flex flex-col bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-full relative">
                    <div className="p-6 pb-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-1 ring-slate-700 relative bg-slate-700 flex items-center justify-center">
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
                              width={64}
                              height={64}
                              className="opacity-80"
                            />
                          )}
                      </div>
                    </div>

                    <CardHeader className="text-center">
                      <CardTitle className="text-xl group-hover:text-blue-300 transition-all duration-300">
                        {message.position} 挨拶
                      </CardTitle>
                      <div className="text-white/70">
                        <p className="font-semibold transition-all duration-300 group-hover:text-white/90">
                          {message.name}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-white/80 mb-2 leading-relaxed flex-1 transition-all duration-300 group-hover:text-white/90 text-center">
                        {getExcerpt(message)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-gradient-to-r text-white/90 from-blue-600 to-indigo-600 w-full pointer-events-none">
                        続きを読む
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1 translate-y-[0.2px]" />
                      </Button>
                    </CardFooter>
                    <Link
                      href={`/message/${message.slug}`}
                      className="absolute inset-0 z-10"
                      aria-label="メッセージ詳細へ"
                    />
                    <div className="absolute bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none">
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
