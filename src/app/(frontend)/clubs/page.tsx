import configPromise from "@payload-config";
import { getPayload } from "payload";
import { WaveText } from "@/components/ui/wave-text";
import type { Club } from "@/payload-types";
import type { Metadata } from "next";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { generateMeta } from "@/utilities/generateMeta";
import ClubGrid from "@/components/ClubGrid";

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
    limit: 0,
    sort: "name",
    draft: false,
  });

  return (
    <div>
      <div className="container mx-auto text-center">
        <WaveText text="CLUBS" />
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ClubGrid clubs={clubs.docs as Club[]} />
        </div>
      </section>
    </div>
  );
}
