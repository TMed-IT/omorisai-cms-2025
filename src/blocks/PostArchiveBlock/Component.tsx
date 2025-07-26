import type { Post } from "@/payload-types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import RichText from "@/components/RichText";
import { PostCard } from "./PostCard";

type PostArchiveBlockProps = {
    id?: string;
    introContent?: any;
    limit?: number;
};

export const PostArchiveBlock: React.FC<PostArchiveBlockProps> = async (
    props,
) => {
    const { id, introContent, limit: limitFromProps } = props;

    const limit = limitFromProps || 10;

    const payload = await getPayload({ config: configPromise });

    const fetchedPosts = await payload.find({
        collection: "posts",
        depth: 1,
        limit,
    });

    const posts = fetchedPosts.docs;

    return (
        <div className="my-16" id={`block-${id}`}>
            {introContent && (
                <div className="container mb-16">
                    <RichText
                        className="ms-0 max-w-[48rem]"
                        data={introContent}
                        enableGutter={false}
                    />
                </div>
            )}
            <div className="w-full max-w-none">
                <div className="flex flex-col divide-y divide-blue-900">
                    {posts?.map((post: Post, index: number) => {
                        if (typeof post === "object" && post !== null) {
                            return (
                                <PostCard
                                    key={index}
                                    post={post}
                                    index={index}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};
