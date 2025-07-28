import { getCachedGlobal } from "@/utilities/getGlobals";
import { SloganBlockClient } from "./Component.client";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    id?: string;
    showEnglish?: boolean;
    showJapanese?: boolean;
    showDescription?: boolean;
    animationType?:
        | "fade"
        | "slide"
        | "typewriter"
        | "burst"
        | "starfield"
        | "lightstreak"
        | "disintegrate"
        | "parallax";
};

export const SloganBlock: React.FC<Props> = async ({
    showEnglish = true,
    showJapanese = true,
    showDescription = true,
    animationType = "fade",
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
            animationType={animationType}
        />
    );
};
