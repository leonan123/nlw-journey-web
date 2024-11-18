import { api } from '../lib/axios'

interface CreateActivityData {
  tripId: string
  title: string
  occursAt: string
}

export interface CreateActivityDataResponse {
  id: string
}

export interface CreateActivityDataResponseError {
  message: string
}

export function createActivity({
  tripId,
  title,
  occursAt,
}: CreateActivityData) {
  return api.post<CreateActivityDataResponse | CreateActivityDataResponseError>(
    `/trips/${tripId}/activities`,
    {
      title,
      occurs_at: occursAt,
    },
  )
}
