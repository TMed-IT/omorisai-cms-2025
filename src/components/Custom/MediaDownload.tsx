"use client";

import React from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { getMediaUrl } from "@/utilities/getMediaUrl";
import { Button } from "@/components/ui/button";

const MediaDownload: React.FC = () => {
    const { data } = useDocumentInfo() as any;
    const fields = useFormFields(([f]) => f) as any;

    const filename = (fields?.filename?.value as string | undefined) ||
        (data?.filename as string | undefined) || undefined;

    const sizes = (fields?.sizes?.value as Record<string, any> | undefined) ||
        undefined;
    const firstSizeUrl = (() => {
        if (!sizes || typeof sizes !== "object") return undefined;
        for (const k of Object.keys(sizes)) {
            const v = sizes[k];
            if (v && typeof v.url === "string" && v.url) return v.url as string;
        }
        return undefined;
    })();

    const rawUrl = (data?.url as string | undefined) ||
        (fields?.url?.value as string | undefined) || firstSizeUrl || undefined;
    const href = rawUrl
        ? getMediaUrl(rawUrl)
        : (filename
            ? `/api/media/file/${encodeURIComponent(filename)}`
            : undefined);

    return (
        <div style={{ marginTop: 8 }}>
            {href
                ? (
                    <Button asChild>
                        <a
                            href={href}
                            download={filename}
                            target="_blank"
                            rel="noreferrer"
                        >
                            メディアをダウンロード
                        </a>
                    </Button>
                )
                : (
                    <Button variant="secondary" disabled>
                        ダウンロード不可
                    </Button>
                )}
        </div>
    );
};

export default MediaDownload;
