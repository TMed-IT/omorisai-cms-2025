import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Media } from "@/components/Media";
import type { Club } from "@/payload-types";

export default async function ClubPage() {
  const payload = await getPayload({ config: configPromise });
  const clubs = await payload.find({ collection: "clubs" });

  return (
    <main>
      <h1>部活紹介</h1>
      <div>
        {clubs.docs.map((club: Club) => (
          <div key={club.id}>
            <h2>{club.name}</h2>
            <Media resource={club.image} />
            <div dangerouslySetInnerHTML={{ __html: club.description }} />
          </div>
        ))}
      </div>
    </main>
  );
}
