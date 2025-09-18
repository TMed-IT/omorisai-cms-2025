"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import {
    FadeIn,
    SlideIn,
    Stagger,
    StaggerItem,
} from "@/components/Animations/animations";
import {
    formatDateByISOFormat,
    formatDateByLocale,
} from "@/utilities/formatDateTime";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    festivalData: FestivalGlobal;
    badgeText?: string;
    showSchedule?: boolean;
    showLocation?: boolean;
    dateFormat?: {
        startDateFormat?: string;
        endDateFormat?: string;
    };
};

export const FestivalInfoBlockClient: React.FC<Props> = ({
    festivalData,
    badgeText = "",
    showSchedule = false,
    showLocation = false,
    dateFormat,
}) => {
    const festivalInfo = festivalData?.festivalInfo;

    const festivalYear = festivalInfo?.year || "2024";

    const getFormattedSchedule = () => {
        if (!festivalInfo?.startDate || !festivalInfo?.endDate) {
            return "日程未定";
        }

        const startDate = new Date(festivalInfo.startDate);
        const endDate = new Date(festivalInfo.endDate);

        const startFormat = dateFormat?.startDateFormat;
        const endFormat = dateFormat?.endDateFormat;

        let formattedStart: string;
        let formattedEnd: string;

        if (startFormat) {
            formattedStart = formatDateByISOFormat(startDate, startFormat);
        } else {
            formattedStart = formatDateByLocale(startDate, "ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Tokyo",
            });
        }

        if (endFormat) {
            formattedEnd = formatDateByISOFormat(endDate, endFormat);
        } else {
            formattedEnd = formatDateByLocale(endDate, "ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Tokyo",
            });
        }

        return `${formattedStart} - ${formattedEnd}`;
    };

    const schedule = getFormattedSchedule();
    const location = festivalInfo?.location || "";

    return (
        <div className="relative z-10 flex items-center justify-center px-4">
            <div className="text-center max-w-6xl mx-auto">
                <div className="mb-12">
                    {badgeText && (
                        <FadeIn delay={0.2}>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 px-6 py-2 text-sm font-semibold mb-6">
                                {badgeText}
                            </Badge>
                        </FadeIn>
                    )}

                    <FadeIn delay={0.4}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 mb-6 tracking-tight">
                            大森祭
                        </h1>
                    </FadeIn>

                    <SlideIn delay={0.6} direction="up">
                        <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
                            OMORI FESTIVAL {festivalYear}
                        </div>
                    </SlideIn>

                    {(showSchedule || showLocation) && (
                        <Stagger>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                {showSchedule && (
                                    <StaggerItem>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            <span className="font-semibold">
                                                {schedule}
                                            </span>
                                        </div>
                                    </StaggerItem>
                                )}
                                {showLocation && (
                                    <StaggerItem>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            <span className="font-semibold">
                                                {location}
                                            </span>
                                        </div>
                                    </StaggerItem>
                                )}
                            </div>
                        </Stagger>
                    )}
                </div>
            </div>
        </div>
    );
};
