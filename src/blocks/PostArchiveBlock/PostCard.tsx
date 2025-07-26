"use client";

import type { Post } from "@/payload-types";
import React from "react";

export const PostCard: React.FC<{ post: Post; index: number }> = (
    { post, index },
) => {
    const { slug, title, publishedAt, meta } = post;
    const { description } = meta || {};

    const sanitizedDescription = description?.replace(/\s/g, " ");
    const href = `/posts/${slug}`;

    let dateStr = "";
    if (publishedAt) {
        const date = new Date(publishedAt);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        dateStr = `${mm}/${dd}`;
    }

    return (
        <article
            key={index}
            className="group flex flex-row items-center w-full max-w-none py-4 border-b border-blue-900 last:border-b-0 transition-colors duration-200 hover:bg-blue-900/40"
        >
            <div className="flex flex-col items-center justify-center min-w-[64px] mr-8">
                <span className="text-base text-blue-300 font-bold tracking-widest leading-none select-none">
                    {dateStr}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                {title && (
                    <h3 className="font-bold text-xl text-white mb-1 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                        <a
                            href={href}
                            className="hover:text-blue-300 transition-colors duration-150"
                        >
                            {title}
                        </a>
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
