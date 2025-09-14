import type { Metadata } from "next";

import React from "react";

import { Footer } from "@/Footer/Component";
import { Header } from "@/Header/Component";
import { Providers } from "@/providers";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import { draftMode } from "next/headers";
import { isStaticExport } from "@/utilities/isStaticExport";

import "./globals.css";
import { getServerSideURL } from "@/utilities/getURL";
import ClientMain from "./ClientMain";
import {
  castoroTitling,
  mPlus1Code,
  notoSansJP,
  shipporiMinchoB1,
  zenKakuGothicNew,
} from "./ui/fonts";

export default async function RootLayout(
  { children }: { children: React.ReactNode },
) {
  const { isEnabled } = await draftMode();
  const showAdminBar = !isStaticExport();
  let AdminBarComp: React.ComponentType<any> | null = null;
  if (showAdminBar) {
    const m = await import("@/components/AdminBar");
    AdminBarComp = m.AdminBar;
  }

  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${zenKakuGothicNew.variable} ${notoSansJP.variable} ${mPlus1Code.variable} ${shipporiMinchoB1.variable} ${castoroTitling.variable}`}
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body
        className={"bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"}
      >
        <Providers>
          {AdminBarComp && (
            <AdminBarComp
              adminBarProps={{
                preview: isEnabled,
              }}
            />
          )}

          <Header />
          <ClientMain>{children}</ClientMain>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@omorisai",
  },
};

export const dynamic = "force-dynamic";
