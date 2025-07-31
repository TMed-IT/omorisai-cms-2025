"use client";

import React, { useEffect, useState } from "react";

const BeforeLogin: React.FC = () => {
  const [isCloudflareAvailable, setIsCloudflareAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkCloudflareAuth();
  }, []);

  const checkCloudflareAuth = async () => {
    try {
      const response = await fetch("/api/cloudflare-auth", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Cloudflare認証チェック失敗:", response.status);
        setIsCloudflareAvailable(false);
        return;
      }

      const data = await response.json();
      setIsCloudflareAvailable(data.authenticated || false);
    } catch (error) {
      console.error("Cloudflare認証チェックエラー:", error);
      setIsCloudflareAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCloudflareLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cloudflare-auth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`ログインエラー: ${error.error}`);
      }
    } catch (error) {
      console.error("Cloudflareログインエラー:", error);
      alert("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #e1e5e9",
          backgroundColor: "#f7f9fb",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #ddd",
              borderTop: "2px solid #666",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          認証方法を確認中...
        </div>
      </div>
    );
  }

  if (!isCloudflareAvailable) {
    return null;
  }

  return (
    <div
      style={{
        padding: "20px",
        borderBottom: "1px solid #e1e5e9",
        backgroundColor: "#f7f9fb",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={handleCloudflareLogin}
          disabled={isLoading}
          style={{
            backgroundColor: "#f6821f",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            opacity: isLoading ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {isLoading ? "ログイン中..." : "🔐 Cloudflare Accessでログイン"}
        </button>
      </div>

      <p
        style={{
          margin: "0",
          fontSize: "14px",
          color: "#666",
        }}
      >
        メールアドレスとパスワードでログインしてください
      </p>
    </div>
  );
};

export default BeforeLogin;
