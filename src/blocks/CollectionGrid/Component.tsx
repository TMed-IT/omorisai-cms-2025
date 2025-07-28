import type { Post } from "@/payload-types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import RichText from "@/components/RichText";

import { CollectionArchive } from "@/components/CollectionArchive";

type CollectionGridProps = {
    id?: string;
    introContent?: any;
    limit?: number;
    populateBy?: "collection" | "selection";
    selectedDocs?: Array<{ value: any }>;
    relationTo?: string;
};

export const CollectionGrid: React.FC<CollectionGridProps> = async (props) => {
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
            <CollectionArchive posts={posts} />
        </div>
    );
};
