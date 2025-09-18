import React from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

import { WaveText } from "@/components/ui/wave-text";
import type { Header } from "@/payload-types";

type Props = {
  path: string;
  fallback: string;
  className?: string;
};

const normalizePath = (input: string): string => {
  try {
    const url = new URL(input, "http://localhost");
    const pathname = url.pathname.replace(/\/+$/, "");
    return pathname === "" ? "/" : pathname;
  } catch {
    const pathname = input.replace(/\/+$/, "");
    return pathname === "" ? "/" : pathname;
  }
};

export default async function PageTitle({ path, fallback, className }: Props) {
  const payload = await getPayload({ config: configPromise });

  const headerData: Header = await payload.findGlobal({
    slug: "header",
    depth: 1,
  });

  const navItems = headerData?.navItems || [];
  const target = normalizePath(path);

  const matched = navItems.find((item: any) => {
    const url: string | undefined = item?.link?.url;
    if (!url) return false;
    return normalizePath(url) === target;
  });

  const title = (matched as any)?.link?.label || fallback;

  return (
    <div className={className ?? "container mx-auto text-center"}>
      <WaveText text={title} />
    </div>
  );
}

