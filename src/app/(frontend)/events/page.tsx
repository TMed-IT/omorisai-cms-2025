import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Media } from '@/components/Media'

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({ collection: 'events' })

  return (
    <main>
      <h1>イベント</h1>
      <div>
        {events.docs.map((event: any) => (
          <div key={event.id}>
            <h2>{event.title}</h2>
            <p>日時: {event.date}</p>
            <p>場所: {event.location}</p>
            <Media resource={event.thumbnail} />
          </div>
        ))}
      </div>
    </main>
  )
}