import configPromise from "@payload-config";
import { getPayload } from "payload";
import PageTitle from "@/components/PageTitle";
import type { Event } from "@/payload-types";
import type { Metadata } from "next";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { generateMeta } from "@/utilities/generateMeta";
import { getHeaderTitleForPath } from "@/utilities/getPageTitle";
import EventGrid from "@/components/EventGrid";

export async function generateMetadata(): Promise<Metadata> {
  const pageMetadataData = await getCachedGlobal("pageMetadata", 1)();
  const pageMetadata = (pageMetadataData as any)?.events;
  const headerData = await getCachedGlobal("header", 1)();
  const computedTitle = getHeaderTitleForPath({
    header: headerData as any,
    path: "/events",
    fallback: "EVENTS",
  });

  return generateMeta({
    staticPageMetadata: {
      description: pageMetadata?.description,
      ogImage: pageMetadata?.ogImage,
    },
    computedTitle,
  });
}

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({
    collection: "events",
    draft: false,
    limit: 0,
    overrideAccess: false,
    pagination: false,
  });

  const sortedEvents = events.docs.sort((a: Event, b: Event) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateA - dateB;
  });

  return (
    <div>
      <PageTitle path="/events" fallback="EVENTS" />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <EventGrid events={sortedEvents as Event[]} />
        </div>
      </section>
    </div>
  );
}
