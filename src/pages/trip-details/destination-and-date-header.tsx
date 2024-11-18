import { MapPin, Calendar, Settings2 } from 'lucide-react'
import { Button } from '../../components/button'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import { formatRangeDateToDisplay } from '../../helpers/format-range-date-to-display'

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)

  useEffect(() => {
    async function fetchTrip() {
      const response = await api.get<Record<'trip', Trip>>(`/trips/${tripId}`)
      const trip = response.data.trip

      if (!trip) return

      setTrip(trip)
    }

    fetchTrip()
  }, [tripId])

  const displayedDate = formatRangeDateToDisplay(trip?.starts_at, trip?.ends_at)

  return (
    <div className="flex h-16 items-center justify-between rounded-xl bg-zinc-900 px-4 shadow-shape">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className="h-6 w-px bg-zinc-800" />

        <Button variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>
    </div>
  )
}
