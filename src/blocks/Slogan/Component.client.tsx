"use client";

import React, { useEffect, useState } from "react";
import type { Festival as FestivalGlobal } from "@/payload-types";

type Props = {
    festivalData: FestivalGlobal;
    showEnglish?: boolean;
    showJapanese?: boolean;
    showDescription?: boolean;
};

type ParallaxJourneyProps = {
    english?: string | null;
    japanese?: string | null;
    description?: string | null;
};

function ParallaxJourney(
    { english, japanese, description }: ParallaxJourneyProps,
) {
    const [isMounted, setIsMounted] = useState(false);
    const [showSlogan, setShowSlogan] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => {
            setShowSlogan(true);
        }, 500);
        return () => {
            setIsMounted(false);
            clearTimeout(timer);
        };
    }, []);

    if (!isMounted) {
        return (
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "#0a0f1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid rgba(255,255,255,0.3)",
                        borderTop: "3px solid #ffffff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <style jsx>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
                </style>
            </div>
        );
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                minHeight: "200vh",
                overflow: "hidden",
                perspective: "1000px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50vh",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: "none",
                    fontFamily: "var(--font-shippori-mincho-b1), serif",
                    zIndex: 10,
                    padding: "0",
                    opacity: showSlogan ? 1 : 0,
                    transition:
                        "opacity 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
            >
                {japanese && (
                    <h1
                        style={{
                            fontSize: "96px",
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "0.05em",
                            color: "#e0f2fe",
                            margin: "0 0 1rem 0",
                            fontFamily: "var(--font-shippori-mincho-b1), serif",
                            textShadow: "0 4px 8px rgba(0,0,0,0.6)",
                            opacity: showSlogan ? 1 : 0,
                            transform: showSlogan
                                ? "translateY(0) rotateX(0deg) scale(1)"
                                : "translateY(60px) rotateX(-20deg) scale(0.7)",
                            transition:
                                "opacity 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
                            filter: showSlogan ? "blur(0px)" : "blur(2px)",
                            transitionProperty: "opacity, transform, filter",
                        }}
                    >
                        {japanese}
                    </h1>
                )}
                {english && (
                    <h2
                        style={{
                            fontSize: "40px",
                            fontWeight: 400,
                            lineHeight: 1.2,
                            color: "#7dd3fc",
                            margin: 0,
                            opacity: showSlogan ? 1 : 0,
                            fontFamily: "var(--font-castoro-titling), serif",
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                            transform: showSlogan
                                ? "translateY(0) rotateX(0deg) scale(1)"
                                : "translateY(40px) rotateX(-15deg) scale(0.8)",
                            transition:
                                "opacity 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s, transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s",
                            filter: showSlogan ? "blur(0px)" : "blur(1px)",
                            transitionProperty: "opacity, transform, filter",
                        }}
                    >
                        {english}
                    </h2>
                )}
            </div>

            {description && (
                <div
                    style={{
                        position: "absolute",
                        top: "150vh",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "100%",
                        maxWidth: "min(1000px, 92vw)",
                        fontSize: "22px",
                        lineHeight: 1.8,
                        color: "#f8fafc",
                        opacity: 1,
                        textAlign: "center",
                        textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                        background:
                            "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                        padding:
                            "clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)",
                        borderRadius: "16px",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        overflow: "hidden",
                        pointerEvents: "none",
                        fontFamily: "var(--font-shippori-mincho-b1), serif",
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background:
                                "linear-gradient(90deg, transparent 0%, #7dd3fc 50%, transparent 100%)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background:
                                "linear-gradient(90deg, transparent 0%, #7dd3fc 50%, transparent 100%)",
                        }}
                    />
                    <p
                        style={{
                            margin: 0,
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        {description.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < description.split("\n").length - 1 && (
                                    <br />
                                )}
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            )}
        </div>
    );
}

export const SloganBlockClient: React.FC<Props> = ({
    festivalData,
    showEnglish = true,
    showJapanese = true,
    showDescription = true,
}) => {
    const sloganData = festivalData?.slogan;

    if (!sloganData) {
        return null;
    }

    const { english, japanese, description } = sloganData;

    return (
        <ParallaxJourney
            english={showEnglish ? english : undefined}
            japanese={showJapanese ? japanese : undefined}
            description={showDescription ? description : undefined}
        />
    );
};
