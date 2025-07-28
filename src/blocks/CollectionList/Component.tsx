import type { Post } from "@/payload-types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import RichText from "@/components/RichText";
import { PostCard } from "./PostCard";

type CollectionListProps = {
    id?: string;
    introContent?: any;
    limit?: number;
    populateBy?: "collection" | "selection";
    selectedDocs?: Array<{ value: any }>;
    relationTo?: string;
};

export const CollectionList: React.FC<CollectionListProps> = async (props) => {
    const {
        id,
        introContent,
        limit: limitFromProps,
        populateBy,
        selectedDocs,
        relationTo,
    } = props;

    const limit = limitFromProps || 10;

    let posts: any[] = [];

    if (populateBy === "collection") {
        const payload = await getPayload({ config: configPromise });

        const fetchedPosts = await payload.find({
            collection: (relationTo || "posts") as any,
            depth: 1,
            limit,
        });

        posts = fetchedPosts.docs;
    } else {
        if (selectedDocs?.length) {
            const filteredSelectedPosts = selectedDocs.map((post) => {
                if (typeof post.value === "object") return post.value;
            }) as any[];

            posts = filteredSelectedPosts;
        }
    }

    return (
        <div className="my-16 md:my-24" id={`block-${id}`}>
            {introContent && (
                <div className="container mb-12 md:mb-16">
                    <RichText
                        className="ms-0 max-w-[48rem]"
                        data={introContent}
                        enableGutter={false}
                    />
                </div>
            )}
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                        <div className="flex flex-col divide-y divide-blue-900/50">
                            {posts?.map((post: any, index: number) => {
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
            </div>
        </div>
    );
};
