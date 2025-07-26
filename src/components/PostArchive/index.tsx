import { cn } from "@/utilities/ui";
import React from "react";

import { Card, CardPostData } from "@/components/Card";

export type Props = {
    posts: CardPostData[];
};

export const PostArchive: React.FC<Props> = (props) => {
    const { posts } = props;

    return (
        <div className={cn("w-full max-w-none")}>
            <div className="flex flex-col divide-y divide-blue-900">
                {posts?.map((result, index) => {
                    if (typeof result === "object" && result !== null) {
                        return (
                            <Card
                                key={index}
                                doc={result}
                                relationTo="posts"
                                className="w-full"
                            />
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
};
