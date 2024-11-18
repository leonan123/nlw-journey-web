import { X, User, Mail } from 'lucide-react'
import type { FormEvent } from 'react'
import { Button } from '../../components/button'

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void
  setOwnerName: (name: string) => void
  setOwnerEmail: (email: string) => void
  createTrip: (ev: FormEvent<HTMLFormElement>) => void
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  setOwnerName,
  setOwnerEmail,
  createTrip,
}: ConfirmTripModalProps) {
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Confirmar criação de viagem
            </h2>

            <button type="button" onClick={closeConfirmTripModal}>
              <X className="size-5 text-zinc-400" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para{' '}
            <span className="font-semibold text-zinc-100">
              Florianópolis, Brasil
            </span>{' '}
            nas datas de{' '}
            <span className="font-semibold text-zinc-100">
              16 a 27 de Agosto de 2024
            </span>{' '}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={createTrip} className="space-y-3">
          <div className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 px-4">
            <User className="size-5 text-zinc-400" />

            <input
              name="name"
              type="text"
              required
              placeholder="Seu nome completo"
              className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
              onChange={(ev) => setOwnerName(ev.target.value)}
            />
          </div>

          <div className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 px-4">
            <Mail className="size-5 text-zinc-400" />

            <input
              name="email"
              type="email"
              required
              placeholder="Seu e-mail pessoal"
              className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
              onChange={(ev) => setOwnerEmail(ev.target.value)}
            />
          </div>

          <Button size="full" type="submit">
            Confirmar criação da viagem
          </Button>
        </form>
      </div>
    </div>
  )
}
