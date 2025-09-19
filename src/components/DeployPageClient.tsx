"use client";

import React, { useEffect, useRef, useState } from "react";
import DeploymentHistory from "@/components/DeploymentHistory";

interface DeployStatus {
    id: string;
    status: "pending" | "building" | "deploying" | "success" | "error";
    timestamp: string;
    duration?: number;
    error?: string;
    buildUrl?: string;
}

export default function DeployPageClient() {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStatus, setDeployStatus] = useState<DeployStatus | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const sourceRef = useRef<EventSource | null>(null);
    const pollTimerRef = useRef<any>(null);

    const stopLogsStream = () => {
        try { sourceRef.current?.close(); } catch {}
        sourceRef.current = null;
    };

    const startLogsStream = () => {
        stopLogsStream();
        try {
            const s = new EventSource(`/api/deploy/logs`);
            s.onmessage = (ev) => setLogs((prev) => [...prev, ev.data]);
            s.addEventListener("error", () => {
                try { s.close(); } catch {}
            });
            sourceRef.current = s;
        } catch {}
    };

    const stopPolling = () => {
        if (pollTimerRef.current) {
            clearTimeout(pollTimerRef.current);
            pollTimerRef.current = null;
        }
    };

    const pollStatus = async () => {
        try {
            const res = await fetch(`/api/deploy/status`, { headers: { Accept: "application/json" }, cache: "no-store" });
            if (!res.ok) {
                stopPolling();
                setIsDeploying(false);
                return;
            }
            const s = await res.json();
            setDeployStatus((prev) => prev ? { ...prev, status: s.status } : { id: 'shared', status: s.status, timestamp: new Date().toISOString() });
            if (s.status === "pending" || s.status === "building" || s.status === "deploying") {
                pollTimerRef.current = setTimeout(pollStatus, 1500);
            } else {
                // finished (success/error)
                setIsDeploying(false);
                stopPolling();
                stopLogsStream();
                if (s.status === 'idle' || s.status === 'error' || s.status === 'success') {
                    // Ensure UI can start a new deploy; clear old logs view
                    setLogs([]);
                }
            }
        } catch {
            stopPolling();
            setIsDeploying(false);
        }
    };

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        const prevHtmlBg = html.style.backgroundColor;
        const prevBodyBg = body.style.backgroundColor;
        const prevBodyMargin = body.style.margin;
        html.style.backgroundColor = "#0b0b0f";
        body.style.backgroundColor = "#0b0b0f";
        body.style.margin = "0";
        return () => {
            html.style.backgroundColor = prevHtmlBg;
            body.style.backgroundColor = prevBodyBg;
            body.style.margin = prevBodyMargin;
        };
    }, []);

    useEffect(() => {
        const onUR = (e: PromiseRejectionEvent) => {
            e.preventDefault();
            console.error("unhandledrejection:", e.reason);
        };
        window.addEventListener("unhandledrejection", onUR);
        // try resume if running
        (async () => {
            try {
                const res = await fetch('/api/deploy/status', { cache: 'no-store' });
                if (res.ok) {
                    const s = await res.json();
                    if (s && (s.status === 'pending' || s.status === 'building' || s.status === 'deploying')) {
                        setDeployStatus({ id: 'shared', status: s.status, timestamp: new Date().toISOString() });
                        setIsDeploying(true);
                        setLogs([]);
                        startLogsStream();
                        stopPolling();
                        pollStatus();
                    } else {
                        // not running
                        setIsDeploying(false);
                        stopLogsStream();
                        stopPolling();
                    }
                }
            } catch {}
        })();
        return () => {
            window.removeEventListener("unhandledrejection", onUR);
            stopPolling();
            stopLogsStream();
        };
    }, []);

    const handleDeploy = async () => {
        setIsDeploying(true);
        const newDeploy: DeployStatus = {
            id: 'shared',
            status: "pending",
            timestamp: new Intl.DateTimeFormat("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Asia/Tokyo",
            }).format(new Date()),
        };
        setDeployStatus(newDeploy);

        try {
            const response = await fetch("/api/deploy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            const ct = response.headers.get("content-type") || "";
            if (!response.ok && response.status !== 202 && response.status !== 409) {
                const text = await response.text().catch(() => "");
                throw new Error("デプロイの開始に失敗しました");
            }
            // after start or if already running, fetch status and start polling/streaming accordingly
            try {
                const statusResponse = await fetch(`/api/deploy/status`, { headers: { Accept: "application/json" }, cache: "no-store" });
                if (statusResponse.ok) {
                    const s = await statusResponse.json();
                    setDeployStatus({ id: 'shared', status: s.status, timestamp: new Date().toISOString() });
                    if (s.status === 'pending' || s.status === 'building' || s.status === 'deploying') {
                        startLogsStream();
                        stopPolling();
                        pollStatus();
                    } else {
                        setIsDeploying(false);
                        stopLogsStream();
                    }
                }
            } catch {}
        } catch (error) {
            console.error("デプロイエラー:", error);
            setDeployStatus((
                prev,
            ) => (prev
                ? {
                    ...prev,
                    status: "error",
                    error: error instanceof Error
                        ? error.message
                        : "不明なエラーが発生しました",
                }
                : null)
            );
            setIsDeploying(false);
        }
    };

    const renderStatusText = (status: DeployStatus["status"]) => {
        if (status === "success") return "成功";
        if (status === "error") return "エラー";
        if (status === "building") return "ビルド中";
        if (status === "deploying") return "デプロイ中";
        return "待機中";
    };

    return (
        <div
            style={{
                minHeight: "100svh",
                width: "100%",
                background: "#0b0b0f",
                color: "#e5e7eb",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
                paddingTop: "calc(24px + env(safe-area-inset-top))",
                paddingRight: "calc(24px + env(safe-area-inset-right))",
                paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
                paddingLeft: "calc(24px + env(safe-area-inset-left))",
                position: "relative",
                overflowX: "hidden",
            }}
        >
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "#0b0b0f",
                    zIndex: 0,
                }}
            />
            <div
                style={{
                    maxWidth: 960,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#f3f4f6",
                            }}
                        >
                            本番サイトにデプロイ
                        </h1>
                        <p style={{ color: "#9ca3af", marginTop: 8 }}>
                            admin以外の全てのルートを静的サイトとして書き出し、Cloudflare
                            Pagesにデプロイします
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        style={{
                            padding: "10px 16px",
                            borderRadius: 8,
                            border: "1px solid #26262b",
                            background: isDeploying ? "#1f2937" : "#111827",
                            color: isDeploying ? "#9ca3af" : "#f9fafb",
                            cursor: isDeploying ? "not-allowed" : "pointer",
                        }}
                    >
                        {isDeploying ? "デプロイ中..." : "デプロイ開始"}
                    </button>
                </div>

                {deployStatus && (
                    <div
                        style={{
                            marginTop: 24,
                            border: "1px solid #26262b",
                            borderRadius: 12,
                            padding: 16,
                            background: "#0f1117",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 12,
                            }}
                        >
                            <div style={{ fontWeight: 600, color: "#e5e7eb" }}>
                                現在のデプロイ状況
                            </div>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "#d1d5db",
                                    border: "1px solid #26262b",
                                    padding: "2px 8px",
                                    borderRadius: 999,
                                }}
                            >
                                {renderStatusText(deployStatus.status)}
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "#9ca3af",
                                marginBottom: 8,
                            }}
                        >
                            開始時刻: {deployStatus.timestamp}
                        </div>
                        {(deployStatus.status === "pending" ||
                            deployStatus.status === "building" ||
                            deployStatus.status === "deploying") && (
                            <div
                                style={{
                                    width: "100%",
                                    height: 8,
                                    background: "#1f2937",
                                    borderRadius: 999,
                                }}
                            >
                                <div
                                    style={{
                                        width: deployStatus.status === "pending"
                                            ? "30%"
                                            : deployStatus.status === "building"
                                                ? "60%"
                                                : "90%",
                                        height: 8,
                                        background: "#60a5fa",
                                        borderRadius: 999,
                                        transition: "width 0.3s",
                                    }}
                                />
                            </div>
                        )}
                        {deployStatus.error && (
                            <div
                                style={{
                                    marginTop: 12,
                                    background: "#2a0f12",
                                    color: "#fecaca",
                                    border: "1px solid #7f1d1d",
                                    padding: 12,
                                    borderRadius: 8,
                                }}
                            >
                                {deployStatus.error}
                            </div>
                        )}
                        {deployStatus.status === "success" &&
                            deployStatus.buildUrl && (
                            <div
                                style={{
                                    marginTop: 12,
                                    display: "flex",
                                    gap: 8,
                                }}
                            >
                                <a
                                    href={deployStatus.buildUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: "8px 12px",
                                        border: "1px solid #26262b",
                                        borderRadius: 8,
                                        textDecoration: "none",
                                        color: "#e5e7eb",
                                    }}
                                >
                                    サイトを確認
                                </a>
                                <button
                                    style={{
                                        padding: "8px 12px",
                                        border: "1px solid #26262b",
                                        borderRadius: 8,
                                        background: "transparent",
                                        color: "#e5e7eb",
                                    }}
                                >
                                    ログをダウンロード
                                </button>
                            </div>
                        )}
                        {logs.length > 0 && (
                            <div
                                style={{
                                    marginTop: 12,
                                    background: "#0b0d12",
                                    border: "1px solid #26262b",
                                    padding: 12,
                                    borderRadius: 8,
                                    maxHeight: 280,
                                    overflow: "auto",
                                    fontFamily:
                                        "var(--font-mono, ui-monospace, SFMono-Regular)",
                                    fontSize: 12,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {logs.map((l, i) => <div key={i}>{l}</div>)}
                            </div>
                        )}
                    </div>
                )}

                <DeploymentHistory />
            </div>
        </div>
    );
}
