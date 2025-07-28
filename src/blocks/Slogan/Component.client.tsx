"use client";

import {
    Disintegrate,
    FadeIn,
    LightStreak,
    ParallaxText,
    SlideIn,
    Starfield,
    TextBurst,
    Typewriter,
} from "@/components/Animations/animations";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    festivalData: FestivalGlobal;
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

export const SloganBlockClient: React.FC<Props> = ({
    festivalData,
    showEnglish = true,
    showJapanese = true,
    showDescription = true,
    animationType = "fade",
}) => {
    const sloganData = festivalData?.slogan;

    if (!sloganData) {
        return null;
    }

    const { english, japanese, description } = sloganData;

    const renderAnimation = (children: React.ReactNode, delay: number) => {
        switch (animationType) {
            case "slide":
                return (
                    <SlideIn delay={delay} direction="up">{children}</SlideIn>
                );
            case "typewriter":
                return (
                    <Typewriter
                        text={typeof children === "string" ? children : ""}
                        delay={delay}
                        speed={80}
                        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
                    />
                );
            case "burst":
                return <TextBurst delay={delay}>{children}</TextBurst>;
            case "starfield":
                return <Starfield delay={delay}>{children}</Starfield>;
            case "lightstreak":
                return <LightStreak delay={delay}>{children}</LightStreak>;
            case "disintegrate":
                return <Disintegrate delay={delay}>{children}</Disintegrate>;
            case "parallax":
                return (
                    <ParallaxText delay={delay} offset={80}>
                        {children}
                    </ParallaxText>
                );
            default:
                return <FadeIn delay={delay}>{children}</FadeIn>;
        }
    };

    return (
        <div className="text-center max-w-4xl mx-auto px-4">
            {showEnglish && english && (
                <div className="mb-4">
                    {renderAnimation(
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                            {english}
                        </h2>,
                        0.2,
                    )}
                </div>
            )}

            {showJapanese && japanese && (
                <div className="mb-6">
                    {renderAnimation(
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90">
                            {japanese}
                        </h3>,
                        0.4,
                    )}
                </div>
            )}

            {showDescription && description && (
                <div className="mb-8">
                    {renderAnimation(
                        <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                            {description}
                        </p>,
                        0.6,
                    )}
                </div>
            )}
        </div>
    );
};
