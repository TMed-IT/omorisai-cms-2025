"use client";

import React, { useEffect, useState } from "react";

interface CurrentDeployment {
    id: string;
    url: string;
    environment: string;
    status: string;
    stageName: string;
    createdOn: string;
    triggerType: string;
    branch?: string;
    commitHash?: string;
    commitMessage?: string;
}

interface Project {
    name: string;
    subdomain: string;
    domains: string[];
}

interface CurrentDeploymentResponse {
    currentDeployment: CurrentDeployment | null;
    project: Project;
}

export default function CurrentDeploymentStatus() {
    const [currentDeployment, setCurrentDeployment] = useState<
        CurrentDeployment | null
    >(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentDeployment = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/deploy/current");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error ||
                        "現在のデプロイメントの取得に失敗しました",
                );
            }

            const data: CurrentDeploymentResponse = await response.json();
            setCurrentDeployment(data.currentDeployment);
            setProject(data.project);
        } catch (err) {
            console.error("現在のデプロイメント取得エラー:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "不明なエラーが発生しました",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentDeployment();
    }, []);

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Tokyo",
        }).format(new Date(dateString));
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "success":
                return "#10b981";
            case "failure":
            case "error":
                return "#ef4444";
            case "active":
            case "building":
                return "#3b82f6";
            default:
                return "#6b7280";
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case "success":
                return "公開中";
            case "failure":
            case "error":
                return "失敗";
            case "active":
                return "アクティブ";
            case "building":
                return "ビルド中";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    marginTop: 24,
                    border: "1px solid #26262b",
                    borderRadius: 12,
                    padding: 16,
                    background: "#0f1117",
                }}
            >
                <div style={{ color: "#9ca3af", textAlign: "center" }}>
                    現在のデプロイメントを読み込み中...
                </div>
            </div>
        );
    }

    if (error) {
        return (
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
                        background: "#2a0f12",
                        color: "#fecaca",
                        border: "1px solid #7f1d1d",
                        padding: 12,
                        borderRadius: 8,
                    }}
                >
                    {error}
                </div>
                <button
                    onClick={fetchCurrentDeployment}
                    style={{
                        marginTop: 12,
                        padding: "8px 16px",
                        border: "1px solid #26262b",
                        borderRadius: 8,
                        background: "transparent",
                        color: "#e5e7eb",
                        cursor: "pointer",
                    }}
                >
                    再試行
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                marginTop: 24,
                border: "1px solid #26262b",
                borderRadius: 12,
                padding: 16,
                background: "#0f1117",
            }}
        >
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                     @keyframes pulse {
                         0%, 100% { opacity: 1; }
                         50% { opacity: 0.5; }
                     }
                 `,
                }}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
            >
                <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#e5e7eb",
                        margin: 0,
                    }}
                >
                    現在公開中のバージョン
                </h2>
                <button
                    onClick={fetchCurrentDeployment}
                    style={{
                        padding: "6px 12px",
                        border: "1px solid #26262b",
                        borderRadius: 6,
                        background: "transparent",
                        color: "#9ca3af",
                        cursor: "pointer",
                        fontSize: 12,
                    }}
                >
                    更新
                </button>
            </div>

            {!currentDeployment
                ? (
                    <div
                        style={{
                            color: "#9ca3af",
                            textAlign: "center",
                            padding: 24,
                        }}
                    >
                        現在公開中のデプロイメントがありません
                    </div>
                )
                : (
                    <div
                        style={{
                            border: "1px solid #26262b",
                            borderRadius: 8,
                            padding: 16,
                            background: "#0b0d12",
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
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: getStatusColor(
                                            currentDeployment.status,
                                        ),
                                        boxShadow: `0 0 8px ${
                                            getStatusColor(
                                                currentDeployment.status,
                                            )
                                        }40`,
                                        animation: "pulse 2s infinite",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 14,
                                        color: getStatusColor(
                                            currentDeployment.status,
                                        ),
                                        fontWeight: 600,
                                    }}
                                >
                                    {getStatusText(currentDeployment.status)}
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                {formatDate(currentDeployment.createdOn)}
                            </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <div
                                style={{
                                    fontSize: 16,
                                    color: "#e5e7eb",
                                    marginBottom: 4,
                                    fontWeight: 500,
                                }}
                            >
                                {currentDeployment.commitMessage ||
                                    "デプロイメント"}
                            </div>
                            {currentDeployment.commitHash && (
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "#9ca3af",
                                        fontFamily: "monospace",
                                        background: "#1f2937",
                                        padding: "4px 8px",
                                        borderRadius: 4,
                                        display: "inline-block",
                                    }}
                                >
                                    {currentDeployment.commitHash.substring(
                                        0,
                                        8,
                                    )}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                {currentDeployment.branch &&
                                    `ブランチ: ${currentDeployment.branch}`}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {currentDeployment.url && (
                                    <a
                                        href={currentDeployment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: 12,
                                            color: "#60a5fa",
                                            textDecoration: "none",
                                            border: "1px solid #26262b",
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            background: "transparent",
                                        }}
                                    >
                                        サイトを確認
                                    </a>
                                )}
                                {project && project.domains.length > 0 && (
                                    <a
                                        href={`https://${project.domains[0]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: 12,
                                            color: "#10b981",
                                            textDecoration: "none",
                                            border: "1px solid #26262b",
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            background: "transparent",
                                        }}
                                    >
                                        本番サイト
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
