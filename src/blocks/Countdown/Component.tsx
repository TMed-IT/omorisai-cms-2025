import { getCachedGlobal } from "@/utilities/getGlobals";
import { CountdownBlockClient } from "./Component.client";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    id?: string;
    showCountdown?: boolean;
    announcementText?: string;
    noticeText?: string;
};

export const CountdownBlock: React.FC<Props> = async ({
    showCountdown = false,
    announcementText = "",
    noticeText = "",
}) => {
    const festivalData = await getCachedGlobal(
        "festival",
        1,
    )() as FestivalGlobal;

    return (
        <CountdownBlockClient
            festivalData={festivalData}
            showCountdown={showCountdown}
            announcementText={announcementText}
            noticeText={noticeText}
        />
    );
};
