import { HeaderClient } from "./Component.client";
import { getCachedGlobal } from "@/utilities/getGlobals";
import React from "react";

import type { Festival, Header } from "@/payload-types";

export async function Header() {
  const headerData: Header = await getCachedGlobal("header", 1)();
  const festivalData = await getCachedGlobal("festival", 1)() as Festival;

  return <HeaderClient data={headerData} _festivalData={festivalData} />;
}
