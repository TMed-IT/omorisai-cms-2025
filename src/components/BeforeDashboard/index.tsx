import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>ダッシュボードへようこそ</h4>
      </Banner>
      次に行うべきこと：
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' で新しいサイトを始めるためのページ、投稿、プロジェクトを追加し、その後 '}
          <a href="/" target="_blank">
            ウェブサイトを閲覧
          </a>
          {' して結果を確認してください'}
        </li>
        <li>
          Payload Cloudを使用してこのリポジトリを作成した場合は、GitHubに移動してローカルマシンにクローンしてください。プロジェクト作成時に選択した <i>GitHub Scope</i> の下にあります。
        </li>
        <li>
          {'必要に応じて '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            コレクション
          </a>
          {' を修正し、より多くの '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            フィールド
          </a>
          {' を追加してください。Payloadが初めての場合は、'}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            はじめに
          </a>
          {' のドキュメントも確認することをお勧めします。'}
        </li>
        <li>
          リポジトリに変更をコミットしてプッシュし、プロジェクトの再デプロイをトリガーしてください。
        </li>
      </ul>
      {'プロのヒント：このブロックは '}
      <a
        href="https://payloadcms.com/docs/admin/custom-components/overview#base-component-overrides"
        rel="noopener noreferrer"
        target="_blank"
      >
        カスタムコンポーネント
      </a>
      {' です。<strong>payload.config</strong> を更新することでいつでも削除できます。'}
    </div>
  )
}

export default BeforeDashboard
