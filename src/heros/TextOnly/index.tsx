import React from "react";

import type { Page } from "@/payload-types";

import { WaveText } from "@/components/ui/wave-text";

type TextOnlyHeroType =
  | {
    children?: React.ReactNode;
    text?: never;
  }
  | (Omit<Page["hero"], "richText"> & {
    children?: never;
    richText?: Page["hero"]["text"];
  });

export const TextOnlyHero: React.FC<TextOnlyHeroType> = (
  { children, text },
) => {
  return (
    <div className="container mt-16">
      <div className="container mx-auto text-center">
        {children || (text && <WaveText text={text} />)}
      </div>
    </div>
  );
};
