import type { Metadata } from "next";

import { RelatedPosts } from "@/blocks/RelatedPosts/Component";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { draftMode } from "next/headers";
import React, { cache } from "react";
import RichText from "@/components/RichText";
import { Button } from "@/components/ui/button";
import { FloatIn, RevealText } from "@/components/Animations/animations";
import Link from "next/link";

import type { Post } from "@/payload-types";

import { generateMeta } from "@/utilities/generateMeta";
import { LivePreviewListener } from "@/components/LivePreviewListener";

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true") {
    return [];
  }

  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: "posts",
    draft: false,
    // Fetch all docs to generate every static route
    limit: 0,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = posts.docs.map(({ slug }) => {
    return { slug };
  });

  return params;
}

export const revalidate = 1;

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "" } = await paramsPromise;
  const url = "/posts/" + slug;
  const post = await queryPostBySlug({ slug });

  if (!post) return <PayloadRedirects url={url} />;

  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : null;
  const dateStr = publishedAt
    ? `${String(publishedAt.getFullYear())}.${
      String(publishedAt.getMonth() + 1).padStart(2, "0")
    }.${String(publishedAt.getDate()).padStart(2, "0")}`
    : "";

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <section className="relative p-4">
        <div className="container mx-auto max-w-4xl">
          <header className="py-6 space-y-4">
            <RevealText>
              <h1 className="text-3xl md:text-4xl text-center font-bold">
                {post.title}
              </h1>
            </RevealText>

            <FloatIn>
              <div className="flex items-center justify-center">
                {dateStr && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-200 border border-blue-500/30">
                    {dateStr}
                  </span>
                )}
              </div>
            </FloatIn>
          </header>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          <main className="space-y-8 py-6">
            <FloatIn>
              <div>
                <div className="text-white max-w-none">
                  <RichText data={post.content} />
                </div>
              </div>
            </FloatIn>
          </main>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          <div className="flex justify-center py-6">
            <Link href="/posts/">
              <Button
                variant="secondary"
                className="border border-slate-600 bg-slate-700 hover:bg-slate-600"
              >
                お知らせ一覧に戻る
              </Button>
            </Link>
          </div>

          {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 hover:from-blue-500/3 hover:to-purple-500/3 transition-all duration-500 pointer-events-none" /> */}

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p) => typeof p === "object")}
            />
          )}
        </div>
      </section>
    </article>
  );
}

export async function generateMetadata(
  { params: paramsPromise }: Args,
): Promise<Metadata> {
  const { slug = "" } = await paramsPromise;
  const post = await queryPostBySlug({ slug });

  return generateMeta({ doc: post });
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "posts",
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});
