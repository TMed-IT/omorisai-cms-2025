import React from "react";

const baseClass = "before-dashboard";

const WelcomeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <h2>ようこそ！</h2>
      <p>この管理画面からウェブサイトの情報を管理できます。</p>
      <p>左のメニューからページやお知らせの管理ができます。</p>
    </div>
  );
};

export default WelcomeDashboard;
