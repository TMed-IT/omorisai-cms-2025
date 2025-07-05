import type { Metadata } from 'next'

export default function MessagePage() {
  return (
    <div className="pt-16 pb-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">メッセージ</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            大森祭に関するメッセージやお知らせを掲載しています。
          </p>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `メッセージ - 大森祭ウェブサイト管理システム`,
  }
} 