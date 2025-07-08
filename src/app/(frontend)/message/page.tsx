import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function MessagePage() {
  const payload = await getPayload({ config: configPromise })
  const messages = await payload.find({ collection: 'messages' })

  return (
    <main>
      <h1>メッセージ</h1>
      <div>
        {messages.docs.map((msg: any) => (
          <div key={msg.id}>
            <h2>{msg.position}：{msg.name}</h2>
            <div dangerouslySetInnerHTML={{ __html: msg.message }} />
          </div>
        ))}
      </div>
    </main>
  )
}