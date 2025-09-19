import type { Metadata } from "next/types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import PageClient from "./page.client";
import { generateMeta } from "@/utilities/generateMeta";
import { getHeaderTitleForPath } from "@/utilities/getPageTitle";
import { PostCard } from "@/blocks/CollectionList/PostCard";
import PageTitle from "@/components/PageTitle";
import { getCachedGlobal } from "@/utilities/getGlobals";

export default async function Page() {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "posts",
    draft: false,
    depth: 1,
    limit: 0,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
    },
  });

  return (
    <div>
      <PageClient />
      <PageTitle path="/posts" fallback="お知らせ" />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex flex-col divide-y divide-blue-900/50">
                {posts.docs?.map((post: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                  if (typeof post === "object" && post !== null) {
                    return (
                      <PostCard
                        key={index}
                        post={post}
                        index={index}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageMetadataData = await getCachedGlobal("pageMetadata", 1)();
  const pageMetadata = (pageMetadataData as any)?.posts;
  const headerData = await getCachedGlobal("header", 1)();
  const computedTitle = getHeaderTitleForPath({
    header: headerData as any,
    path: "/posts",
    fallback: "お知らせ",
  });

  return generateMeta({
    staticPageMetadata: {
      description: pageMetadata?.description,
      ogImage: pageMetadata?.ogImage,
    },
    computedTitle,
  });
}
