import { api } from '../lib/axios'

interface InviteSomeoneToTripRequest {
  tripId: string
  email: string
}

export function inviteSomeoneToTrip({
  email,
  tripId,
}: InviteSomeoneToTripRequest) {
  return api.post(`/trips/${tripId}/invites`, {
    email,
  })
}
