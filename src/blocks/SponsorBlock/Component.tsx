import type { Sponsor as SponsorsProps } from "@/payload-types";

import { cn } from "@/utilities/ui";
import React from "react";
import { Media } from "@/components/Media";
import Link from "next/link";
import { getCachedGlobal } from "@/utilities/getGlobals";
import type { Sponsor } from "@/payload-types";

type Props = {
    className?: string;
};

const SponsorItem: React.FC<{
    sponsor: NonNullable<SponsorsProps["sponsors"]>[0];
}> = ({ sponsor }) => {
    const { type, companyName, logo, url } = sponsor;

    const content = (
        <div
            className={cn(
                "flex items-center justify-center rounded-lg transition-colors w-full",
                // ロゴは枠や余白を排除して余計な黒枠を出さない
                type !== "textOnly"
                    ? "p-0 bg-transparent border-0 hover:bg-transparent"
                    : "p-4 border border-border bg-card hover:bg-card/80",
            )}
        >
            {type === "textOnly" ? (
                <span className="text-lg font-medium text-center leading-relaxed">
                    {companyName}
                </span>
            ) : (
                <div className="flex flex-col items-center gap-2 w-full">
                    {logo && typeof logo === "object" && (
                        <div
                            className={cn(
                                // 3:1 枠。オーバーフローは非表示、背景は透過
                                "relative mx-auto aspect-[3/1] overflow-hidden bg-transparent w-full",
                                {
                                    // 600x200 target box (3:1 aspect) up to max width, otherwise shrink within grid
                                    "max-w-[600px]": type === "logoLarge",
                                    // 300x100 target box up to max width, otherwise shrink within grid
                                    "max-w-[300px]": type === "logoSmall",
                                },
                            )}
                        >
                            <Media
                                className="absolute inset-0"
                                resource={logo}
                                fill
                                pictureClassName="block w-full h-full"
                                imgClassName="object-contain"
                                alt={companyName || "スポンサー ロゴ"}
                                size={type === "logoLarge"
                                    ? "(max-width: 640px) 90vw, 600px"
                                    : "(max-width: 640px) 90vw, 300px"}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (url) {
        return (
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full hover:opacity-80 transition-opacity"
            >
                {content}
            </Link>
        );
    }

    return content;
};

const SponsorSection: React.FC<{
    sponsors: NonNullable<SponsorsProps["sponsors"]>;
    gridCols: string;
}> = ({ sponsors, gridCols }) => {
    if (!sponsors || sponsors.length === 0) {
        return null;
    }

    return (
        <div className="mb-12 w-full">
            <div className={cn("grid gap-6", gridCols)}>
                {sponsors.map((sponsor, index) => (
                    <SponsorItem key={index} sponsor={sponsor} />
                ))}
            </div>
        </div>
    );
};

const SponsorsDisplay: React.FC<{
    className?: string;
    sponsors?: SponsorsProps["sponsors"];
}> = ({ className, sponsors }) => {
    if (!sponsors || sponsors.length === 0) {
        return null;
    }

    const logoLargeSponsors = sponsors.filter((sponsor) =>
        sponsor.type === "logoLarge"
    );
    const logoSmallSponsors = sponsors.filter((sponsor) =>
        sponsor.type === "logoSmall"
    );
    const textOnlySponsors = sponsors.filter((sponsor) =>
        sponsor.type === "textOnly"
    );

    return (
        <div className={cn("container mx-auto my-8", className)}>
            <h2 className="text-3xl font-bold mb-8 text-center">スポンサー</h2>

            {logoLargeSponsors.length > 0 && (
                <SponsorSection
                    sponsors={logoLargeSponsors}
                    // Larger boxes, fewer columns; stretch items horizontally
                    gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-items-stretch"
                />
            )}

            {logoSmallSponsors.length > 0 && (
                <SponsorSection
                    sponsors={logoSmallSponsors}
                    // Smaller boxes, more columns; stretch items horizontally
                    gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-items-stretch"
                />
            )}

            {textOnlySponsors.length > 0 && (
                <SponsorSection
                    sponsors={textOnlySponsors}
                    gridCols="grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 items-center justify-items-stretch"
                />
            )}
        </div>
    );
};

export const SponsorBlock: React.FC<Props> = async ({ className }) => {
    // Depth=1 to resolve uploaded media relation for `logo`
    const sponsorsData = await getCachedGlobal("sponsors", 1)() as Sponsor;

    return (
        <SponsorsDisplay
            sponsors={sponsorsData?.sponsors}
            className={className}
        />
    );
};
