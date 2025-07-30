import { getCachedGlobal } from "@/utilities/getGlobals";
import { SloganBlockClient } from "./Component.client";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    showEnglish?: boolean;
    showJapanese?: boolean;
    showDescription?: boolean;
};

export const SloganBlock: React.FC<Props> = async ({
    showEnglish = true,
    showJapanese = true,
    showDescription = true,
}) => {
    const festivalData = await getCachedGlobal(
        "festival",
        1,
    )() as FestivalGlobal;

    return (
        <SloganBlockClient
            festivalData={festivalData}
            showEnglish={showEnglish}
            showJapanese={showJapanese}
            showDescription={showDescription}
        />
    );
};
