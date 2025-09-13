"use client";

import Link from "next/link";
import React from "react";

const baseClass = "before-dashboard";

const WelcomeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <h2>ようこそ！</h2>
      <p>この管理画面からウェブサイトの情報を管理できます。</p>
      <p>左のメニューからページやお知らせの管理ができます。</p>
      <p>
        現在のプレビューサイト全体の内容を反映するには、<Link href="/admin/deploy">
          デプロイ管理ページ
        </Link>にアクセスしてください。
      </p>
    </div>
  );
};

export default WelcomeDashboard;
