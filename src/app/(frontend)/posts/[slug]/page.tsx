import type { Metadata } from "next";

import { RelatedPosts } from "@/blocks/RelatedPosts/Component";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { draftMode } from "next/headers";
import React, { cache } from "react";
import RichText from "@/components/RichText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FloatIn, RevealText } from "@/components/Animations/animations";
import Link from "next/link";

import type { Post } from "@/payload-types";

import { generateMeta } from "@/utilities/generateMeta";
import PageClient from "./page.client";
import { LivePreviewListener } from "@/components/LivePreviewListener";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: "posts",
    draft: false,
    limit: 1000,
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
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <section className="relative pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/posts">
            <Button
              variant="outline"
              className="mb-8 border-slate-600 bg-transparent hover:bg-transparent transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              お知らせ一覧
            </Button>
          </Link>

          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden relative shadow-xl">
            <CardHeader className="pb-6">
              <RevealText>
                <CardTitle className="text-3xl md:text-4xl mb-2 text-center">
                  {post.title}
                </CardTitle>
              </RevealText>

              <FloatIn>
                <div className="flex items-center justify-center gap-2">
                  {dateStr && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-200 border border-blue-500/30">
                      {dateStr}
                    </span>
                  )}
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
                      <RichText data={post.content} />
                    </div>
                  </div>
                </div>
              </FloatIn>
            </CardContent>

            <div className="px-6 pb-8">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6" />
              <div className="flex justify-center">
                <Link href="/posts">
                  <Button
                    variant="secondary"
                    className="border border-slate-600 bg-slate-700 hover:bg-slate-600"
                  >
                    お知らせ一覧に戻る
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 hover:from-blue-500/3 hover:to-purple-500/3 transition-all duration-500 pointer-events-none" />
          </Card>

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
