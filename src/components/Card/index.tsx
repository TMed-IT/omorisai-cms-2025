"use client";
import { cn } from "@/utilities/ui";
import useClickableCard from "@/utilities/useClickableCard";
import Link from "next/link";
import React from "react";

import type { Post } from "@/payload-types";

export type CardPostData = Pick<
  Post,
  "slug" | "meta" | "title" | "publishedAt"
>;

export const Card: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CardPostData;
  relationTo?: "posts";
  showCategories?: boolean;
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories: _showCategories,
    title: titleFromProps,
  } = props;

  const { slug, meta, title, publishedAt } = doc || {};
  const { description } = meta || {};

  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " ");
  const href = `/${relationTo}/${slug}`;

  let dateStr = "";
  if (publishedAt) {
    const date = new Date(publishedAt);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    dateStr = `${mm}/${dd}`;
  }

  return (
    <article
      className={cn(
        "group flex flex-row items-center w-full max-w-none px-0 py-4 border-b border-blue-900 last:border-b-0",
        "transition-colors duration-200 hover:bg-blue-900/40",
        className,
      )}
      ref={card.ref}
    >
      <div className="flex flex-col items-center justify-center min-w-[64px] mr-8">
        <span className="text-base text-blue-300 font-bold tracking-widest leading-none select-none">
          {dateStr}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {titleToUse && (
          <h3 className="font-bold text-xl text-white mb-1 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
            <Link
              href={href}
              ref={link.ref}
              className="hover:text-blue-300 transition-colors duration-150"
            >
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          <p className="text-base text-blue-100 truncate">
            {sanitizedDescription}
          </p>
        )}
      </div>

      <div className="ml-8 flex items-center">
        <span className="text-blue-400 group-hover:text-blue-200 text-3xl font-bold select-none">
          ≫
        </span>
      </div>
    </article>
  );
};
