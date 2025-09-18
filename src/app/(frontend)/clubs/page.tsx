import configPromise from "@payload-config";
import { getPayload } from "payload";
import PageTitle from "@/components/PageTitle";
import type { Club } from "@/payload-types";
import type { Metadata } from "next";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { generateMeta } from "@/utilities/generateMeta";
import { getHeaderTitleForPath } from "@/utilities/getPageTitle";
import ClubGrid from "@/components/ClubGrid";

export async function generateMetadata(): Promise<Metadata> {
  const pageMetadataData = await getCachedGlobal("pageMetadata", 1)();
  const pageMetadata = (pageMetadataData as any)?.clubs;
  const headerData = await getCachedGlobal("header", 1)();
  const computedTitle = getHeaderTitleForPath({
    header: headerData as any,
    path: "/clubs",
    fallback: "CLUBS",
  });

  return generateMeta({
    staticPageMetadata: {
      description: pageMetadata?.description,
      ogImage: pageMetadata?.ogImage,
    },
    computedTitle,
  });
}

export default async function ClubPage() {
  const payload = await getPayload({ config: configPromise });
  const clubs = await payload.find({
    collection: "clubs",
    limit: 0,
    sort: "name",
    draft: false,
  });

  return (
    <div>
      <PageTitle path="/clubs" fallback="CLUBS" />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ClubGrid clubs={clubs.docs as Club[]} />
        </div>
      </section>
    </div>
  );
}
