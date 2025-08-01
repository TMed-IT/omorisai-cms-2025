"use client";

import React, { useEffect, useState } from "react";

const BeforeLogin: React.FC = () => {
  const [isCloudflareAvailable, setIsCloudflareAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [cloudflareUser, setCloudflareUser] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  useEffect(() => {
    checkCloudflareAuth();
  }, []);

  useEffect(() => {
    if (isCloudflareAvailable && !cloudflareUser && !isLoading && !hasAttemptedLogin) {
      setHasAttemptedLogin(true);
      handleCloudflareLogin();
    }
  }, [isCloudflareAvailable, cloudflareUser, hasAttemptedLogin]);

  useEffect(() => {
    if (cloudflareUser) {
      hideExistingForm();
    } else if (error || !isCloudflareAvailable) {
      showExistingForm();
    }
  }, [cloudflareUser, error, isCloudflareAvailable]);

  const checkCloudflareAuth = async () => {
    try {
      const response = await fetch("/api/cloudflare-auth", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setIsCloudflareAvailable(false);
        return;
      }

      const data = await response.json();
      setIsCloudflareAvailable(data.authenticated || false);
    } catch (error) {
      setIsCloudflareAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCloudflareLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cloudflare-auth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCloudflareUser({ email: data.email });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'ユーザー情報の取得に失敗しました');
      }
    } catch (error) {
      setError('ユーザー情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const hideExistingForm = () => {
    const form = document.querySelector('.login__form') as HTMLElement;
    if (form) {
      form.style.display = 'none';
    }
  };

  const showExistingForm = () => {
    const form = document.querySelector('.login__form') as HTMLElement;
    if (form) {
      form.style.display = 'block';
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudflareUser || !password.trim()) return;

    setIsLoginLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cloudflareUser.email,
          password: password,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        setError('パスワードが間違っています');
      }
    } catch (error) {
      setError('ログインに失敗しました');
    } finally {
      setIsLoginLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          color: "#ffffff",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              border: "2px solid #444",
              borderTop: "2px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          認証確認中...
        </div>
      </div>
    );
  }

  if (!isCloudflareAvailable) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          color: "#ffffff",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              border: "2px solid #444",
              borderTop: "2px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          ユーザー情報取得中...
        </div>
      </div>
    );
  }

  if (cloudflareUser) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        <div style={{ marginBottom: "15px", color: "#ffffff", fontSize: "14px" }}>
          <strong>{cloudflareUser.email}</strong> でログイン
        </div>
        
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="cloudflare-password"
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#ffffff",
                fontSize: "12px",
              }}
            >
              パスワード
            </label>
            <input
              id="cloudflare-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
              }}
              disabled={isLoginLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!password.trim() || isLoginLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007acc",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: !password.trim() || isLoginLoading ? "not-allowed" : "pointer",
              opacity: !password.trim() || isLoginLoading ? 0.6 : 1,
            }}
          >
            {isLoginLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        
        {error && (
          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#2a1a1a",
              border: "1px solid #ff6b6b",
              borderRadius: "4px",
              color: "#ff6b6b",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          color: "#ff6b6b",
          fontSize: "12px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          {error}
        </div>
        <button
          onClick={handleCloudflareLogin}
          style={{
            backgroundColor: "#444",
            color: "#ffffff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "11px",
          }}
        >
          再試行
        </button>
      </div>
    );
  }

  return null;
};

export default BeforeLogin;
