import { X, Tag, Calendar } from 'lucide-react'
import { Button } from '../../components/button'
import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createActivity,
  type CreateActivityDataResponseError,
} from '../../http/create-activity'
import { z } from 'zod'
import type { AxiosError } from 'axios'

interface CreateActivityModalProps {
  closeCreateActivityModalOpen: () => void
}

const createActivitySchema = z.object({
  tripId: z.string().min(1),
  title: z.string().min(1),
  occursAt: z.string().min(1),
})

export function CreateActivityModal({
  closeCreateActivityModalOpen,
}: CreateActivityModalProps) {
  const queryClient = useQueryClient()

  const { tripId } = useParams()
  const [formError, setFormError] = useState({
    errorCode: '',
    errorMessage: '',
  })

  const { mutateAsync: createActivityFn } = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activities'],
      })

      closeCreateActivityModalOpen()
    },
    onError: (error: AxiosError<CreateActivityDataResponseError>) => {
      if (!error.response) {
        console.error(error)
        return
      }

      const { message } = error.response!.data

      setFormError({
        errorCode: error.code ?? '',
        errorMessage: message,
      })
    },
  })

  function handleFormSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    const data = new FormData(ev.currentTarget)

    const { error, data: newActivity } = createActivitySchema.safeParse({
      ...Object.fromEntries(data),
      tripId,
    })

    if (error) {
      return
    }

    createActivityFn({ ...newActivity })
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>

            <button type="button" onClick={closeCreateActivityModalOpen}>
              <X className="size-5 text-zinc-400" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleFormSubmit}>
          <div className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 px-4">
            <Tag className="size-5 text-zinc-400" />

            <input
              name="title"
              type="text"
              required
              placeholder="Qual a atividade?"
              className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-14 w-full flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 px-4">
              <Calendar className="size-5 text-zinc-400" />

              <input
                name="occursAt"
                type="datetime-local"
                required
                placeholder="Seu e-mail pessoal"
                className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>
          </div>

          {formError.errorMessage && (
            <span className="text-sm text-red-500">
              {formError.errorMessage}
            </span>
          )}
          <Button size="full">Salvar atividade</Button>
        </form>
      </div>
    </div>
  )
}
