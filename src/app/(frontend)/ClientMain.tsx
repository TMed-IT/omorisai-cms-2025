"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HomeBackground from "@/components/HomeBackground";

export default function ClientMain(
    { children }: { children: React.ReactNode },
) {
    const pathname = usePathname();
    const isHomePage = pathname === "/" || pathname === "/home";

    if (isHomePage) {
        return (
            <>
                <HomeBackground
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />
                <main
                    style={{
                        marginTop: "var(--main-top-offset)",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    {children}
                </main>
            </>
        );
    }

    return (
        <main style={{ marginTop: "var(--main-top-offset)" }}>
            {children}
        </main>
    );
}
