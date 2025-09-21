import type { Metadata } from "next";

import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayload, type RequiredDataFromCollectionSlug } from "payload";
import React, { cache } from "react";

import { RenderBlocks } from "@/blocks/RenderBlocks";
import { RenderHero } from "@/heros/RenderHero";
import { generateMeta } from "@/utilities/generateMeta";
import PageClient from "./page.client";
import { LivePreviewListener } from "@/components/LivePreviewListener";

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true") {
    return [];
  }

  const payload = await getPayload({ config: configPromise });
  const pages = await payload.find({
    collection: "pages",
    draft: false,
    // Fetch all docs to generate every static route
    limit: 0,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== "home";
    })
    .map(({ slug }) => {
      return { slug };
    });

  return params;
}

export const revalidate = 0;

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  let draft = false;
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true") {
    const { draftMode } = await import("next/headers");
    draft = (await draftMode()).isEnabled;
  }
  const { slug = "home" } = await paramsPromise;
  const url = "/" + slug;

  const page: RequiredDataFromCollectionSlug<"pages"> | null =
    await queryPageBySlug({
      slug,
    });

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { hero, layout } = page;

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  );
}

export async function generateMetadata(
  { params: paramsPromise }: Args,
): Promise<Metadata> {
  const { slug = "home" } = await paramsPromise;
  const page = await queryPageBySlug({
    slug,
  });

  return generateMeta({ doc: page });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  let draft = false;
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true") {
    const { draftMode } = await import("next/headers");
    draft = (await draftMode()).isEnabled;
  }

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});
