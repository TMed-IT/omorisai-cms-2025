import React from 'react'
import { SeedButton } from './SeedButton'

const baseClass = 'before-dashboard'

const WelcomeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <h2>ようこそ！</h2>
      <p>この管理画面からウェブサイトの情報を管理できます。</p>
      <p>左のメニューからページや投稿の管理ができます。</p>
      <SeedButton />
    </div>
  )
}

export default WelcomeDashboard
