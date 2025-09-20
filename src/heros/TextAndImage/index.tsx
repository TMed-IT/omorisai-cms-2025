"use client";

import type { Page } from "@/payload-types";

import { Media } from "@/components/Media";
import { WaveText } from "@/components/ui/wave-text";

export const TextAndImageHero: React.FC<Page["hero"]> = ({ media, text }) => {
  return (
    <section
      className="relative -mt-[10.4rem] flex min-h-[60vh] items-center justify-center overflow-hidden"
      data-theme="dark"
      role="banner"
      aria-label="ヒーローセクション"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {media && typeof media === "object" && (
          <Media
            fill
            imgClassName="object-cover object-center"
            priority
            resource={media}
            size="100vw"
          />
        )}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center py-12">
          <div className="text-center">
            {text && (
              <div className="mx-auto max-w-4xl">
                <WaveText text={text} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
