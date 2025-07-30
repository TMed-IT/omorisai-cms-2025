"use client";

import { Calendar } from "lucide-react";
import { FadeIn } from "@/components/Animations/animations";
import { Countdown } from "@/components/Custom/countdown";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    festivalData: FestivalGlobal;
    showCountdown?: boolean;
    announcementText?: string;
    noticeText?: string;
};

export const CountdownBlockClient: React.FC<Props> = ({
    festivalData,
    showCountdown = false,
    announcementText = "",
    noticeText = "",
}) => {
    const festivalInfo = festivalData?.festivalInfo;
    const festivalDate = festivalInfo?.startDate;
    const festivalYear = festivalInfo?.year;

    return (
        <FadeIn delay={1.2}>
            <div className="mb-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                        {showCountdown ? "開催まで" : "開催について"}
                    </h2>
                    <div className="w-20 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full">
                    </div>
                </div>

                <div className="px-8">
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 lg:p-10 border border-white/10 mx-auto max-w-4xl">
                        {showCountdown && festivalDate
                            ? <Countdown targetDate={new Date(festivalDate)} />
                            : (
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Calendar className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                        大森祭 {festivalYear}
                                    </h3>
                                    {announcementText && (
                                        <p className="text-lg md:text-xl text-white/80 mb-4">
                                            {announcementText}
                                        </p>
                                    )}
                                    {noticeText && (
                                        <p className="text-white/60">
                                            {noticeText}
                                        </p>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};
