"use client";
import React from "react";

export default function CustomStyle() {
    React.useEffect(() => {
        if (typeof document !== "undefined") {
            const existingLink = document.querySelector(
                'link[href="/admin-custom.css"]',
            );
            if (!existingLink) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "/admin-custom.css";
                document.head.appendChild(link);
            }
        }
    }, []);

    return null;
}
