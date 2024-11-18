import { api } from '../lib/axios'

interface CreateLinkRequest {
  title: string
  url: string
  tripId: string
}

export async function createLink({ title, url, tripId }: CreateLinkRequest) {
  return api.post(`/trips/${tripId}/links`, {
    title,
    url,
  })
}
