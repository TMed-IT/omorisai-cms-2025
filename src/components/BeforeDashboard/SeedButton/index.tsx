'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    データベースを初期化しました！今すぐ{' '}
    <a target="_blank" href="/">
      ウェブサイトを閲覧
    </a>
    できます
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('データベースは既に初期化されています。')
        return
      }
      if (loading) {
        toast.info('初期化処理が既に進行中です。')
        return
      }
      if (error) {
        toast.error(`エラーが発生しました。ページを更新して再試行してください。`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('初期化処理中にエラーが発生しました。')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: 'データを初期化中....',
            success: <SuccessMessage />,
            error: '初期化処理中にエラーが発生しました。',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (初期化中...)'
  if (seeded) message = ' (完了)'
  if (error) message = ` (エラー: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        データベースを初期化
      </button>
      {message}
    </Fragment>
  )
}
