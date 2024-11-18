import { CircleCheck } from 'lucide-react'
import { api } from '../../lib/axios'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'

interface Activity {
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

export function Activities() {
  const { tripId } = useParams()
  // const [activities, setActivities] = useState<Activity[]>([])

  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await api.get<Record<'activities', Activity[]>>(
        `/trips/${tripId}/activities`,
      )
      const activities = response.data.activities

      return activities
    },
  })

  return (
    <div className="space-y-8">
      {activities &&
        activities.map((category) => (
          <div key={category.date} className="space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-zinc-300">
                Dia {format(category.date, 'dd')}
              </span>
              <span className="text-xs text-zinc-500">
                {format(category.date, 'EEEE', { locale: ptBR })}
              </span>
            </div>

            {category.activities.length ? (
              <div className="space-y-2.5">
                {category.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5 shadow-shape"
                  >
                    <CircleCheck className="size-5 text-lime-300" />
                    <span className="text-zinc-100">{activity.title}</span>
                    <span className="ml-auto text-sm text-zinc-100">
                      {format(activity.occurs_at, 'HH:mm')}h
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Nenhuma atividade cadastrada nessa data.
              </p>
            )}
          </div>
        ))}
    </div>
  )
}
