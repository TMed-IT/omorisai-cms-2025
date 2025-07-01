'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@payloadcms/ui'
import React, { useState, useCallback } from 'react'

const SuccessMessage: React.FC = () => (
  <div>
    データベースを初期化しました！今すぐ{' '}
    <a target="_blank" href="/">
      ウェブサイトを閲覧
    </a>
    できます
  </div>
)

const InitializePage = () => {
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
        toast.error('エラーが発生しました。ページを更新して再試行してください。')
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
    <div className="container py-10">
      <h1>データベース初期化</h1>
      <p>このボタンを押すと、初期データが登録されます。</p>
      <Button onClick={handleClick} disabled={loading || seeded}>
        データベースを初期化
      </Button>
      {message && <div>{message}</div>}
    </div>
  )
}

export default InitializePage 