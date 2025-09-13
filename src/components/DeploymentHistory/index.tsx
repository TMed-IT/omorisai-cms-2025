"use client";

import React, { useEffect, useState } from "react";
import type {
    DeploymentHistoryResponse,
    FormattedDeployment,
} from "@/types/cloudflare";

export default function DeploymentHistory() {
    const [history, setHistory] = useState<FormattedDeployment[]>([]);
    const [currentDeployment, setCurrentDeployment] = useState<
        FormattedDeployment | null
    >(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<
        DeploymentHistoryResponse["pagination"] | null
    >(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rollingBack, setRollingBack] = useState<string | null>(null);
    const [showRollbackDialog, setShowRollbackDialog] = useState(false);
    const [rollbackTarget, setRollbackTarget] = useState<
        FormattedDeployment | null
    >(null);
    const [toast, setToast] = useState<
        { message: string; type: "success" | "error" } | null
    >(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const fetchCurrentDeployment = async () => {
        try {
            const response = await fetch("/api/deploy/current");
            if (response.ok) {
                const data = await response.json();
                console.log("Current Deployment Data:", {
                    currentDeploymentId: data.currentDeployment?.id,
                    currentDeploymentStatus: data.currentDeployment?.status,
                    currentDeploymentCreatedOn: data.currentDeployment
                        ?.createdOn,
                });
                setCurrentDeployment(data.currentDeployment);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error || "現在のデプロイメント取得に失敗しました",
                );
            }
        } catch (err) {
            console.error("現在のデプロイメント取得エラー:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "現在のデプロイメント取得に失敗しました",
            );
        }
    };

    const fetchHistory = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `/api/deploy/history?page=${page}&per_page=10`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "履歴の取得に失敗しました");
            }

            const data: DeploymentHistoryResponse = await response.json();
            console.log("History Data:", {
                historyCount: data.deployments.length,
                historyIds: data.deployments.map((d) => d.id),
                historyStatuses: data.deployments.map((d) => d.status),
            });
            setHistory(data.deployments);
            setPagination(data.pagination);
            setCurrentPage(page);
        } catch (err) {
            console.error("履歴取得エラー:", err);
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
        const onUR = (e: PromiseRejectionEvent) => {
            e.preventDefault();
            console.error("unhandledrejection:", e.reason);
            setError(
                e.reason instanceof Error
                    ? e.reason.message
                    : "予期しないエラーが発生しました",
            );
        };
        window.addEventListener("unhandledrejection", onUR);

        fetchHistory();
        fetchCurrentDeployment();

        return () => window.removeEventListener("unhandledrejection", onUR);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
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
                return "成功";
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

    const renderDeploymentItem = (
        deployment: FormattedDeployment,
        isCurrent: boolean = false,
    ) => (
        <div
            key={deployment.id}
            style={{
                border: isCurrent ? "2px solid #10b981" : "1px solid #26262b",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                background: isCurrent ? "#0f1f0f" : "#0b0d12",
                position: "relative",
            }}
        >
            {isCurrent && (
                <div
                    style={{
                        position: "absolute",
                        top: -8,
                        left: 12,
                        background: "#10b981",
                        color: "#ffffff",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                    }}
                >
                    現在公開中
                </div>
            )}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    {isCurrent && (
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#10b981",
                                boxShadow: "0 0 8px #10b98140",
                                animation: "pulse 2s infinite",
                            }}
                        />
                    )}
                    <span
                        style={{
                            fontSize: 12,
                            color: getStatusColor(deployment.status),
                            border: `1px solid ${
                                getStatusColor(deployment.status)
                            }`,
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontWeight: 500,
                        }}
                    >
                        {getStatusText(deployment.status)}
                    </span>
                    <span
                        style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            border: "1px solid #26262b",
                            padding: "2px 8px",
                            borderRadius: 999,
                        }}
                    >
                        {deployment.environment}
                    </span>
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: "#9ca3af",
                    }}
                >
                    {formatDate(deployment.createdOn)}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        fontSize: 14,
                        color: "#e5e7eb",
                        marginBottom: 4,
                    }}
                >
                    {deployment.commitHash}
                </div>

                <div
                    style={{ display: "flex", gap: 8 }}
                >
                    {deployment.url && (
                        <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: 12,
                                color: "#60a5fa",
                                textDecoration: "none",
                                border: "1px solid #26262b",
                                padding: "4px 8px",
                                borderRadius: 4,
                            }}
                        >
                            サイトを確認
                        </a>
                    )}
                    {deployment.status === "success" && !isCurrent && (
                        <button
                            onClick={() => handleRollbackClick(deployment)}
                            disabled={rollingBack === deployment.id}
                            style={{
                                fontSize: 12,
                                color: rollingBack === deployment.id
                                    ? "#6b7280"
                                    : "#f59e0b",
                                border: "1px solid #26262b",
                                padding: "4px 8px",
                                borderRadius: 4,
                                background: "transparent",
                                cursor: rollingBack === deployment.id
                                    ? "not-allowed"
                                    : "pointer",
                            }}
                        >
                            {rollingBack === deployment.id
                                ? "ロールバック中..."
                                : "ロールバック"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= (pagination?.total_pages || 1)) {
            fetchHistory(newPage);
        }
    };

    const handleRollbackClick = (deployment: FormattedDeployment) => {
        setRollbackTarget(deployment);
        setShowRollbackDialog(true);
    };

    const handleRollbackConfirm = async () => {
        if (!rollbackTarget) return;

        try {
            setRollingBack(rollbackTarget.id);

            const response = await fetch("/api/deploy/rollback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ deploymentId: rollbackTarget.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "ロールバックに失敗しました",
                );
            }

            const data = await response.json();
            setShowRollbackDialog(false);
            setRollbackTarget(null);
            showToast(
                "ロールバックが開始されました。新しいデプロイメントが作成されます。",
                "success",
            );

            fetchHistory(currentPage);
        } catch (err) {
            console.error("ロールバックエラー:", err);
            showToast(
                err instanceof Error
                    ? err.message
                    : "ロールバックに失敗しました",
                "error",
            );
        } finally {
            setRollingBack(null);
        }
    };

    const handleRollbackCancel = () => {
        setShowRollbackDialog(false);
        setRollbackTarget(null);
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
                    履歴を読み込み中...
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
                    onClick={() => fetchHistory(currentPage)}
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
        <>
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
                        @keyframes slideIn {
                            from {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                            to {
                                transform: translateX(0);
                                opacity: 1;
                            }
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
                        デプロイ履歴
                    </h2>
                    <button
                        onClick={() => {
                            fetchHistory(currentPage);
                            fetchCurrentDeployment();
                        }}
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

                {history.length === 0 && !currentDeployment
                    ? (
                        <div
                            style={{
                                color: "#9ca3af",
                                textAlign: "center",
                                padding: 24,
                            }}
                        >
                            デプロイ履歴がありません
                        </div>
                    )
                    : (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                {history.map((deployment) => {
                                    const isCurrent =
                                        deployment.id === currentDeployment?.id;
                                    console.log("Deployment Comparison:", {
                                        deploymentId: deployment.id,
                                        currentDeploymentId: currentDeployment
                                            ?.id,
                                        isCurrent: isCurrent,
                                        deploymentStatus: deployment.status,
                                    });
                                    return renderDeploymentItem(
                                        deployment,
                                        isCurrent,
                                    );
                                })}
                            </div>

                            {pagination && pagination.total_pages > 1 && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        marginTop: 16,
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        style={{
                                            padding: "6px 12px",
                                            border: "1px solid #26262b",
                                            borderRadius: 6,
                                            background: currentPage <= 1
                                                ? "#1f2937"
                                                : "transparent",
                                            color: currentPage <= 1
                                                ? "#6b7280"
                                                : "#e5e7eb",
                                            cursor: currentPage <= 1
                                                ? "not-allowed"
                                                : "pointer",
                                            fontSize: 12,
                                        }}
                                    >
                                        前へ
                                    </button>

                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "#9ca3af",
                                        }}
                                    >
                                        {currentPage} / {pagination.total_pages}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)}
                                        disabled={currentPage >=
                                            pagination.total_pages}
                                        style={{
                                            padding: "6px 12px",
                                            border: "1px solid #26262b",
                                            borderRadius: 6,
                                            background: currentPage >=
                                                    pagination.total_pages
                                                ? "#1f2937"
                                                : "transparent",
                                            color: currentPage >=
                                                    pagination.total_pages
                                                ? "#6b7280"
                                                : "#e5e7eb",
                                            cursor: currentPage >=
                                                    pagination.total_pages
                                                ? "not-allowed"
                                                : "pointer",
                                            fontSize: 12,
                                        }}
                                    >
                                        次へ
                                    </button>
                                </div>
                            )}
                        </>
                    )}
            </div>

            {showRollbackDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#0f1117",
                            border: "1px solid #26262b",
                            borderRadius: 12,
                            padding: 24,
                            maxWidth: 500,
                            width: "90%",
                            color: "#e5e7eb",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                marginBottom: 16,
                                color: "#f3f4f6",
                            }}
                        >
                            ロールバックの確認
                        </h3>
                        <div style={{ marginBottom: 24, lineHeight: 1.6 }}>
                            {rollbackTarget && (
                                <>
                                    このデプロイメントにロールバックしますか？
                                    <br />
                                    <br />
                                    <strong>デプロイメント情報</strong>
                                    <br />
                                    コミットハッシュ：
                                    {rollbackTarget.commitHash}
                                    <br />
                                    作成日時：
                                    {formatDate(rollbackTarget.createdOn)}
                                    <br />
                                </>
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                justifyContent: "flex-end",
                            }}
                        >
                            <button
                                onClick={handleRollbackCancel}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #26262b",
                                    borderRadius: 6,
                                    background: "transparent",
                                    color: "#9ca3af",
                                    cursor: "pointer",
                                }}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleRollbackConfirm}
                                disabled={rollingBack === rollbackTarget?.id}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #26262b",
                                    borderRadius: 6,
                                    background:
                                        rollingBack === rollbackTarget?.id
                                            ? "#1f2937"
                                            : "#dc2626",
                                    color: rollingBack === rollbackTarget?.id
                                        ? "#6b7280"
                                        : "#ffffff",
                                    cursor: rollingBack === rollbackTarget?.id
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            >
                                {rollingBack === rollbackTarget?.id
                                    ? "ロールバック中..."
                                    : "ロールバック実行"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        backgroundColor: toast.type === "success"
                            ? "#10b981"
                            : "#ef4444",
                        color: "#ffffff",
                        padding: "12px 16px",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        zIndex: 1001,
                        maxWidth: 400,
                        fontSize: 14,
                        fontWeight: 500,
                        animation: "slideIn 0.3s ease-out",
                    }}
                >
                    {toast.message}
                </div>
            )}
        </>
    );
}
