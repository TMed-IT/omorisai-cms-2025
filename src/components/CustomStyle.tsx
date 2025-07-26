"use client";
import React from "react";

export default function CustomStyle() {
    React.useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/admin-custom.css";
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);
    return null;
}
