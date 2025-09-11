import type { Metadata } from "next";

import React from "react";

import { AdminBar } from "@/components/AdminBar";
import { Footer } from "@/Footer/Component";
import { Header } from "@/Header/Component";
import { Providers } from "@/providers";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import { draftMode } from "next/headers";

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
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

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

// Ensure App Router statically renders frontend routes for export
export const dynamic = "force-static";
