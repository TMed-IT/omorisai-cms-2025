import type { Metadata } from 'next'

export default function EventsPage() {
  return (
    <div className="pt-16 pb-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">イベント</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            大森祭で開催される様々なイベントの情報をご覧いただけます。
          </p>
        </div>
      </div>
    </div>
  )
}