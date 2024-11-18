import { api } from '../lib/axios'

interface CreateTripRequest {
  destination: string
  startsAt: Date
  endsAt: Date
  ownerName: string
  ownerEmail: string
  emailsToInvite: string[]
}

interface CreateTripResponse {
  tripId: string
}

export async function createTrip({
  destination,
  startsAt,
  endsAt,
  ownerName,
  ownerEmail,
  emailsToInvite,
}: CreateTripRequest) {
  const result = await api.post<CreateTripResponse>('/trips', {
    destination,
    starts_at: startsAt,
    ends_at: endsAt,
    owner_name: ownerName,
    owner_email: ownerEmail,
    emails_to_invite: emailsToInvite,
  })

  return result.data.tripId
}
