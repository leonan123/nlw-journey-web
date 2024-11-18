import { api } from '../lib/axios'

interface GetImportantLinksRequest {
  tripId: string
}

interface GetImportantLinksResponse {
  links: {
    id: string
    title: string
    url: string
  }[]
}

export async function getImportantLinks({ tripId }: GetImportantLinksRequest) {
  const response = await api.get<GetImportantLinksResponse>(
    `/trips/${tripId}/links`,
  )

  return response.data.links
}
