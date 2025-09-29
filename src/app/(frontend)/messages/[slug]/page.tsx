import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatIn, RevealText } from "@/components/Animations/animations";
import Link from "next/link";
import RichText from "@/components/RichText";
import { Media } from "@/components/Media";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "ご挨拶 - 大森祭",
    };
  }

  const payload = await getPayload({ config: configPromise });

  try {
    const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
    const messages = await payload.find({
      collection: "messages",
      draft: false,
      overrideAccess: isStaticExport,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    const message = messages.docs[0];
    if (message) {
      return {
        title: `${message.position} ご挨拶 - 大森祭`,
      };
    }
  } catch (error) {
    console.error("Error generating metadata for message:", error);
  }

  return {
    title: "ご挨拶 - 大森祭",
  };
}

export const revalidate = 1;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MessageDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const payload = await getPayload({ config: configPromise });

  try {
    const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
    const messages = await payload.find({
      collection: "messages",
      draft: false,
      overrideAccess: isStaticExport,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!messages.docs.length) {
      notFound();
    }

    const message = messages.docs[0];

    if (!message) {
      notFound();
    }

    return (
      <section className="relative p-4">
        <div className="container mx-auto max-w-4xl">
          <header className="py-6 space-y-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-32 h-32 rounded-full overflow-hidden relative bg-slate-700 flex items-center justify-center shadow-md ${
                  ((message as any).avatar) ? "" : "ring-2 ring-blue-500/20"
                }`}
              >
                {((message as any).avatar)
                  ? (
                    <Media
                      resource={(message as any).avatar}
                      fill
                      imgClassName="object-cover object-center"
                    />
                  )
                  : (
                    <Image
                      src="/icon-white.svg"
                      alt="avatar"
                      width={96}
                      height={96}
                      className="opacity-80"
                    />
                  )}
              </div>
            </div>
            <RevealText>
              <h1 className="text-3xl md:text-4xl text-center font-bold">
                {message.name}
              </h1>
            </RevealText>

            <FloatIn>
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-200 border border-blue-500/30">
                  {message.position}
                </span>
              </div>
            </FloatIn>
          </header>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          <main className="space-y-8 py-6">
            <FloatIn>
              <div>
                <div className="text-white max-w-none">
                  <RichText data={message.message} />
                </div>
              </div>
            </FloatIn>
          </main>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          <div className="flex justify-center py-6">
            <Link href="/messages/">
              <Button
                variant="secondary"
                className="border border-slate-600 bg-slate-700 hover:bg-slate-600"
              >
                メッセージ一覧に戻る
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  } catch (_error) {
    notFound();
  }
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true") {
    return [];
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const messages = await payload.find({
      collection: "messages",
      draft: false,
      limit: 0,
      overrideAccess: true,
      pagination: false,
      select: { slug: true },
      sort: "order",
    });

    return messages.docs
      .filter((doc: { slug?: string | null }) => Boolean(doc?.slug))
      .map((doc) => ({ slug: doc.slug as string }));
  } catch (error) {
    console.error("Failed to generate static params for messages:", error);
    throw error;
  }
}


