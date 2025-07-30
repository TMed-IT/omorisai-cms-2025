import type { Metadata } from "next/types";

import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import PageClient from "./page.client";
import { generateMeta } from "@/utilities/generateMeta";
import { PostCard } from "@/blocks/CollectionList/PostCard";
import { WaveText } from "@/components/ui/wave-text";

export const dynamic = "force-static";
export const revalidate = 600;

export default async function Page() {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: 12,
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
      <div className="container mx-auto text-center">
        <WaveText text="お知らせ" />
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={12}
              totalDocs={posts.totalDocs}
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex flex-col divide-y divide-blue-900/50">
                {posts.docs?.map((post: any, index: number) => {
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

          {posts.totalPages > 1 && posts.page && (
            <div className="mt-8">
              <Pagination page={posts.page} totalPages={posts.totalPages} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    defaultTitle: "お知らせ一覧",
  });
}
