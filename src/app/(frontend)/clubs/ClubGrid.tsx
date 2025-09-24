"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridItem, StaggerGrid } from "@/components/Animations/animations";
import { Media } from "@/components/Media";
import type { Club } from "@/payload-types";
import RichText from "@/components/RichText";
import { useEffect, useMemo, useState } from "react";

type Props = {
    clubs: Club[];
};

export default function ClubGrid({ clubs }: Props) {
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenId(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const selected = clubs.find((c) => c.id === openId) || null;

    const { boxWidth, boxHeight } = useMemo(() => {
        if (!selected) return { boxWidth: 0, boxHeight: 0 };
        const vw = Math.floor(window.innerWidth * 0.9);
        const vh = Math.floor(window.innerHeight * 0.9);
        const imgW = typeof selected.image === "object"
            ? (selected.image?.width as number | undefined) || vw
            : vw;
        const imgH = typeof selected.image === "object"
            ? (selected.image?.height as number | undefined) || vh
            : vh;
        const scale = Math.min(1, Math.min(vw / imgW, vh / imgH));
        return {
            boxWidth: Math.floor(imgW * scale),
            boxHeight: Math.floor(imgH * scale),
        };
    }, [selected]);

    return (
        <>
            <StaggerGrid>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {clubs.map((club, index) => (
                        <GridItem
                            key={club.id}
                            index={index}
                            className="h-full"
                        >
                            <button
                                type="button"
                                className="text-left w-full h-full"
                                onClick={() => setOpenId(club.id as string)}
                            >
                                <Card className="flex flex-col bg-slate-800/90 border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-500 ease-in-out hover:border-blue-400 h-full relative">
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <Media
                                            resource={club.image}
                                            htmlElement={null}
                                            fill
                                            pictureClassName="absolute inset-0"
                                            imgClassName="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl group-hover:text-blue-300 transition-all duration-300">
                                            {club.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        {club.description && (
                                            <div className="text-white/80 leading-relaxed group-hover:text-white/90 transition-all duration-300">
                                                <RichText
                                                    data={club
                                                        .description as never}
                                                    enableGutter={false}
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
                                </Card>
                            </button>
                        </GridItem>
                    ))}
                </div>
            </StaggerGrid>

            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setOpenId(null)}
                    />
                    <div className="relative z-10 max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-2 sm:p-4">
                        <div
                            className="relative shadow-2xl"
                            style={{
                                width: boxWidth ? `${boxWidth}px` : "90vw",
                                height: boxHeight ? `${boxHeight}px` : "90vh",
                            }}
                        >
                            <Media
                                resource={selected.image}
                                htmlElement={null}
                                fill
                                pictureClassName="absolute inset-0"
                                imgClassName="object-contain"
                                priority
                            />
                            <button
                                type="button"
                                className="absolute -top-3 -right-3 sm:top-2 sm:right-2 h-10 w-10 sm:h-11 sm:w-11 inline-flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 backdrop-blur"
                                onClick={() => setOpenId(null)}
                                aria-label="閉じる"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 1 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
