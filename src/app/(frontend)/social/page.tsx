import { getCachedGlobal } from "@/utilities/getGlobals";
import { Media } from "@/components/Media";

import type { Festival } from "@/payload-types";
import { WaveText } from "@/components/ui/wave-text";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridItem, StaggerGrid } from "@/components/Animations/animations";
import Link from "next/link";

type SocialLink = NonNullable<Festival["socialLinks"]>[0];

export default async function SocialPage() {
  const festivalData = await getCachedGlobal("festival", 1)() as Festival;
  const socialLinks = festivalData?.socialLinks || [];

  return (
    <div>
      <div className="container mx-auto text-center">
        <WaveText text="SNS" />
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StaggerGrid>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {socialLinks.length > 0
                ? (
                  socialLinks.map((socialLink: SocialLink, index: number) => (
                    <GridItem key={index} index={index}>
                      <Link
                        href={socialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-full relative p-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="w-full flex flex-col items-center justify-center pt-8 pb-4">
                          {socialLink.icon
                            ? (
                              <Media
                                resource={socialLink.icon}
                                className="w-20 h-20 object-cover rounded-full group-hover:scale-110 transition-transform duration-500 border-2 border-white shadow-lg bg-white"
                              />
                            )
                            : (
                              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border-2 border-white shadow-lg">
                                <span className="font-bold text-3xl">
                                  {socialLink.label.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                        </div>
                        <CardHeader className="w-full flex flex-col items-center text-center pt-0 pb-2 px-6">
                          <CardTitle className="text-xl group-hover:text-blue-300 transition-all duration-300">
                            {socialLink.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 w-full flex flex-col items-center justify-end px-6 pb-4">
                        </CardContent>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none">
                        </div>
                      </Link>
                    </GridItem>
                  ))
                )
                : (
                  <div className="text-center py-12 animate-fade-in-delay-2 col-span-full">
                    <p className="text-gray-500 dark:text-gray-400">
                      SNSリンクが設定されていません。管理画面でSNSリンクを追加してください。
                    </p>
                  </div>
                )}
            </div>
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
