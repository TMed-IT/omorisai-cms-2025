"use client";

import type {
  PayloadAdminBarProps,
  PayloadMeUser,
} from "@payloadcms/admin-bar";

import { cn } from "@/utilities/ui";
import { useSelectedLayoutSegments } from "next/navigation";
import { PayloadAdminBar } from "@payloadcms/admin-bar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./index.scss";

import { getClientSideURL } from "@/utilities/getURL";

const baseClass = "admin-bar";

const collectionLabels = {
  pages: {
    plural: "ページ",
    singular: "ページ",
  },
  posts: {
    plural: "お知らせ",
    singular: "お知らせ",
  },
  projects: {
    plural: "プロジェクト",
    singular: "プロジェクト",
  },
};

const Title: React.FC = () => <span>ダッシュボード</span>;

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps;
}> = (props) => {
  const { adminBarProps } = props || {};
  const segments = useSelectedLayoutSegments();
  const [show, setShow] = useState(false);
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels]
      ? segments[1]
      : "pages"
  ) as keyof typeof collectionLabels;
  const router = useRouter();

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (show) {
      root.style.setProperty("--admin-bar-height", "36px");
    } else {
      root.style.setProperty("--admin-bar-height", "0px");
    }
  }, [show]);

  return (
    <div
      className={cn(
        baseClass,
        "fixed top-0 left-0 right-0 z-20 py-2 bg-black",
        {
          block: show,
          hidden: !show,
        },
      )}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2"
          classNames={{
            controls: "font-medium",
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || "Pages",
            singular: collectionLabels[collection]?.singular || "Page",
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch("/next/exit-preview").then(() => {
              router.push("/");
              router.refresh();
            });
          }}
          style={{
            backgroundColor: "transparent",
            padding: 0,
            position: "relative",
            zIndex: "unset",
          }}
        />
      </div>
    </div>
  );
};
