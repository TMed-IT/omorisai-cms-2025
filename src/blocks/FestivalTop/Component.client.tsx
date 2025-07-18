"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import {
  FadeIn,
  SlideIn,
  Stagger,
  StaggerItem,
  Typewriter,
} from "@/components/Animations/animations";
import { Countdown } from "@/components/Custom/countdown";
import { BackgroundEffects } from "@/components/Custom/background-effects";
import {
  formatDateByISOFormat,
  formatDateByLocale,
} from "@/utilities/formatDateTime";
import type { FestivalTopBlock as FestivalTopBlockProps } from "@/payload-types";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = Omit<FestivalTopBlockProps, "blockType"> & {
  festivalData: FestivalGlobal;
};

export const FestivalTopBlockClient: React.FC<Props> = ({
  festivalData,
  badgeText = "",
  showCountdown = false,
  showSlogan = false,
  showSchedule = false,
  showLocation = false,
  announcementText = "",
  slogan = "",
  noticeText = "",
  dateFormat,
}) => {
  const festivalInfo = festivalData?.festivalInfo;

  const festivalDate = festivalInfo?.startDate;
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
      });
    }

    if (endFormat) {
      formattedEnd = formatDateByISOFormat(endDate, endFormat);
    } else {
      formattedEnd = formatDateByLocale(endDate, "ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return `${formattedStart} - ${formattedEnd}`;
  };

  const schedule = getFormattedSchedule();
  const location = festivalInfo?.location || "";

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* <BackgroundEffects variant="coming-soon" /> */}

      <div className="relative z-10 flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-12">
            {badgeText && (
              <FadeIn delay={0.2}>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-6 py-2 text-sm font-semibold mb-6">
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
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
                OMORI FESTIVAL {festivalYear}
              </div>
            </SlideIn>

            {showSlogan && slogan && (
              <FadeIn delay={0.8}>
                <Typewriter
                  text={slogan}
                  delay={1.0}
                  speed={80}
                  className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8"
                />
              </FadeIn>
            )}

            {(showSchedule || showLocation) && (
              <Stagger>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  {showSchedule && (
                    <StaggerItem>
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold">{schedule}</span>
                      </div>
                    </StaggerItem>
                  )}
                  {showLocation && (
                    <StaggerItem>
                      <div className="flex items-center gap-2 text-white">
                        <MapPin className="w-5 h-5" />
                        <span className="font-semibold">{location}</span>
                      </div>
                    </StaggerItem>
                  )}
                </div>
              </Stagger>
            )}
          </div>

          <FadeIn delay={1.2}>
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  {showCountdown ? "開催まで" : "開催について"}
                </h2>
                <div className="w-20 md:w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full">
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 lg:p-10 border border-white/10 mx-auto max-w-4xl">
                {showCountdown && festivalDate
                  ? <Countdown targetDate={new Date(festivalDate)} />
                  : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        大森祭 {festivalYear}
                      </h3>
                      {announcementText && (
                        <p className="text-lg md:text-xl text-white/80 mb-4">
                          {announcementText}
                        </p>
                      )}
                      {noticeText && (
                        <p className="text-white/60">{noticeText}</p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};
