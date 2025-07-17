import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Media } from '@/components/Media'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FadeIn, Stagger, StaggerItem } from '@/components/Animations/animations'
import { Calendar, MapPin } from 'lucide-react'
import { formatDateShortJP } from '@/utilities/formatDateTime'
import { WaveText } from '@/components/ui/wave-text'

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({ collection: 'events' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <WaveText 
                text="EVENTS" 
                delay={0.4}
                className="text-6xl font-bold text-white mb-6"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* All Events */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-white mb-12">全イベント</h2>
          </FadeIn>

          <Stagger>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.docs.map((event: any) => (
                <StaggerItem key={event.id}>
                  <Card className="bg-slate-800/80 border-slate-600 backdrop-blur-sm hover:bg-slate-700/80 hover:scale-105 transition-all duration-300 transform group">
                    <div className="relative overflow-hidden">
                      <Media resource={event.thumbnail} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white text-xl group-hover:text-blue-300 transition-colors">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDateShortJP(new Date(event.date))}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </section>
    </div>
  )
}