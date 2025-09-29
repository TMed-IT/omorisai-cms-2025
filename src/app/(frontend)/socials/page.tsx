import { getCachedGlobal } from "@/utilities/getGlobals";
import { Media } from "@/components/Media";

import type { SocialLink } from "@/payload-types";
import PageTitle from "@/components/PageTitle";
import { CardTitle } from "@/components/ui/card";
import { GridItem, StaggerGrid } from "@/components/Animations/animations";
import Link from "next/link";
import type { Metadata } from "next";
import { generateMeta } from "@/utilities/generateMeta";
import { getHeaderTitleForPath } from "@/utilities/getPageTitle";

export async function generateMetadata(): Promise<Metadata> {
  const pageMetadataData = await getCachedGlobal("pageMetadata", 1)();
  const pageMetadata = (pageMetadataData as any)?.socials;
  const headerData = await getCachedGlobal("header", 1)();
  const computedTitle = getHeaderTitleForPath({
    header: headerData as any,
    path: "/socials",
    fallback: "SNS",
  });

  return generateMeta({
    staticPageMetadata: {
      description: pageMetadata?.description,
      ogImage: pageMetadata?.ogImage,
    },
    computedTitle,
  });
}

type SocialLinkItem = NonNullable<SocialLink["socialLinks"]>[0];

export default async function SocialPage() {
  const socialLinksData = await getCachedGlobal(
    "socialLinks",
    1,
  )() as SocialLink;
  const socialLinks = socialLinksData?.socialLinks || [];

  return (
    <div>
      <PageTitle path="/socials" fallback="SNS" />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StaggerGrid>
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {socialLinks.length > 0 && (
                socialLinks.map((socialLink: SocialLinkItem, index: number) => (
                  <GridItem key={index} index={index}>
                    <Link
                      href={socialLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-20 relative p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl"
                      style={{ textDecoration: "none" }}
                    >
                      <div className="flex items-center justify-center mr-4">
                        {socialLink.icon
                          ? (
                            <Media
                              resource={socialLink.icon}
                              className="w-12 h-12 group-hover:scale-110 transition-transform duration-500"
                            />
                          )
                          : (
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border-2 border-white shadow-lg">
                              <span className="font-bold text-lg">
                                {socialLink.label.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-all duration-300">
                          {socialLink.label}
                        </CardTitle>
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none">
                      </div>
                    </Link>
                  </GridItem>
                ))
              )}
            </div>
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
