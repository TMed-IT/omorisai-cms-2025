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
            className="group flex flex-col sm:flex-row items-start sm:items-center w-full p-4 sm:p-6 transition-all duration-200 hover:bg-blue-900/20 first:rounded-t-2xl last:rounded-b-2xl"
        >
            <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[64px] mb-3 sm:mb-0 sm:mr-6 lg:mr-8">
                <span className="text-sm sm:text-base text-blue-300 font-bold tracking-widest leading-none select-none">
                    {dateStr}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                {title && (
                    <h3 className="font-bold text-lg sm:text-xl text-white mb-2 sm:mb-1 tracking-wide line-clamp-2 sm:line-clamp-1">
                        <a
                            href={href}
                            className="hover:text-blue-300 transition-colors duration-150"
                        >
                            {title}
                        </a>
                    </h3>
                )}
                {description && (
                    <p className="text-sm sm:text-base text-blue-100 line-clamp-2 sm:line-clamp-1">
                        {sanitizedDescription}
                    </p>
                )}
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-6 lg:ml-8 flex items-center">
                <span className="text-blue-400 group-hover:text-blue-200 text-2xl sm:text-3xl font-bold select-none transition-colors duration-150">
                    ≫
                </span>
            </div>
        </article>
    );
};
