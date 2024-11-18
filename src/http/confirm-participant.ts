import { api } from '../lib/axios'

interface ConfirmParticipantRequest {
  participantId: string
}

export async function confirmParticipant({
  participantId,
}: ConfirmParticipantRequest) {
  return api.get(`/participants/${participantId}/confirm`)
}
