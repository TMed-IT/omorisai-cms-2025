import { getCachedGlobal } from "@/utilities/getGlobals";
import { FestivalInfoBlockClient } from "./Component.client";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    id?: string;
    badgeText?: string;
    showSchedule?: boolean;
    showLocation?: boolean;
    dateFormat?: {
        startDateFormat?: string;
        endDateFormat?: string;
    };
};

export const FestivalInfoBlock: React.FC<Props> = async ({
    badgeText = "",
    showSchedule = false,
    showLocation = false,
    dateFormat,
}) => {
    const festivalData = await getCachedGlobal(
        "festival",
        1,
    )() as FestivalGlobal;

    return (
        <FestivalInfoBlockClient
            festivalData={festivalData}
            badgeText={badgeText}
            showSchedule={showSchedule}
            showLocation={showLocation}
            dateFormat={dateFormat}
        />
    );
};
