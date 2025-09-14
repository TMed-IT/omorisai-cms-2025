import { HeaderClient } from "./Component.client";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import React from "react";

import type { Festival, Header } from "@/payload-types";

export async function Header() {
  const payload = await getPayload({ config: configPromise });

  const headerData: Header = await payload.findGlobal({
    slug: "header",
    depth: 1,
  });

  const festivalData = await payload.findGlobal({
    slug: "festival",
    depth: 1,
  }) as Festival;

  return <HeaderClient data={headerData} _festivalData={festivalData} />;
}
