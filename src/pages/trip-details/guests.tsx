import {
  AtSign,
  CheckCircle2,
  CircleDashed,
  Loader2,
  Plus,
  UserCog,
  X,
} from 'lucide-react'
import { Button } from '../../components/button'
import { api } from '../../lib/axios'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import { inviteSomeoneToTrip } from '../../http/invite-someone-to-trip'
import type { FormEvent } from 'react'
import { z } from 'zod'
import { confirmParticipant } from '../../http/confirm-participant'

interface Participant {
  id: string
  name: string
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams()
  const queryClient = useQueryClient()

  const { data: participants, isPending } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const response = await api.get<Record<'participants', Participant[]>>(
        `/trips/${tripId}/participants`,
      )

      return response.data.participants
    },
  })

  const { mutateAsync: onInviteSomeone, isPending: isInviting } = useMutation({
    mutationFn: inviteSomeoneToTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participants'],
      })
    },
  })

  const { mutateAsync: onConfirmParticipant } = useMutation({
    mutationFn: confirmParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participants'],
      })
    },
  })

  function handleInviteSomeone(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    const data = new FormData(ev.currentTarget)

    const inviteSomeoneSchema = z.object({
      email: z.string().min(1).email(),
      tripId: z.string().min(1).uuid(),
    })

    const { error, data: newInvite } = inviteSomeoneSchema.safeParse({
      ...Object.fromEntries(data),
      tripId,
    })

    if (error) {
      return
    }

    onInviteSomeone({
      ...newInvite,
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Convidados</h2>

      {participants && (
        <div className="space-y-5">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-8"
            >
              <div className="space-y-1.5">
                <h3 className="font-medium leading-none text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                </h3>

                <span className="inline-block w-full truncate text-sm text-zinc-400">
                  {participant.email}
                </span>
              </div>

              {participant.is_confirmed ? (
                <CheckCircle2 className="size-5 shrink-0 text-green-400" />
              ) : (
                <button
                  onClick={() =>
                    onConfirmParticipant({ participantId: participant.id })
                  }
                >
                  <CircleDashed className="size-5 shrink-0 text-zinc-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="secondary" size="full" disabled={isPending}>
            <UserCog className="size-5" />
            Gerenciar convidados
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 grid place-items-center bg-black/60" />

          <Dialog.Content className="fixed left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
            <div className="space-y-2">
              <Dialog.Title className="text-lg font-semibold">
                Gerenciar convidados
              </Dialog.Title>

              <Dialog.Description className="text-sm text-zinc-400">
                Aqui voce pode gerenciar os convidados da sua viagem.
              </Dialog.Description>
            </div>

            <div className="flex flex-wrap gap-2">
              {participants &&
                participants.map(({ email }) => (
                  <div
                    key={email}
                    className="flex items-center gap-2.5 rounded-md bg-zinc-800 px-2.5 py-1.5"
                  >
                    <span className="text-zinc-300">{email}</span>
                  </div>
                ))}
            </div>

            <div className="h-px w-full bg-zinc-800" />

            <form
              onSubmit={handleInviteSomeone}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5"
            >
              <div className="flex w-full items-center gap-2 px-2">
                <AtSign className="size-5 text-zinc-400" />

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Digite o e-mail do convidado"
                  className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>

              <Button type="submit" disabled={isInviting}>
                {isInviting ? (
                  <>
                    Enviando
                    <Loader2 className="size-5 shrink-0 animate-spin text-lime-950" />
                  </>
                ) : (
                  <>
                    Convidar
                    <Plus className="size-5" />
                  </>
                )}
              </Button>
            </form>

            <Dialog.Close className="absolute right-0 top-0 mr-4 mt-4">
              <X className="size-5 text-zinc-400" />
              <span className="sr-only">Fechar modal</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
