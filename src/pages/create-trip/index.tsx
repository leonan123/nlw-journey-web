import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import type { DateRange } from 'react-day-picker'
import { useMutation } from '@tanstack/react-query'
import { createTrip } from '../../http/create-trip'
import { z } from 'zod'

export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
  const [destination, setDestination] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >()
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')

  const { mutateAsync: onCreateTrip } = useMutation({
    mutationFn: createTrip,
  })

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  function addNewEmailToInvite(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    if (!ev.currentTarget.checkValidity()) {
      return
    }

    const newEmail = new FormData(ev.currentTarget).get('email')!
    const emailAlreadyExits = emailsToInvite.some((email) => email === newEmail)

    if (emailAlreadyExits) {
      alert('Este email já está na lista de convidados.')
      return
    }

    setEmailsToInvite((state) => [...state, newEmail.toString()])

    ev.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemove: string) {
    setEmailsToInvite((state) =>
      state.filter((email) => email !== emailToRemove),
    )
  }

  async function handleCrateTrip(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    console.log(eventStartAndEndDates)

    const createTripSchema = z.object({
      destination: z.string().min(1),
      startsAt: z.date(),
      endsAt: z.date(),
      ownerName: z.string().min(1),
      ownerEmail: z.string().min(1),
      emailsToInvite: z.string().array(),
    })

    const { error, data: newTrip } = createTripSchema.safeParse({
      destination,
      startsAt: eventStartAndEndDates?.from,
      endsAt: eventStartAndEndDates?.to,
      ownerName,
      ownerEmail,
      emailsToInvite,
    })

    if (error) {
      return
    }

    const tripId = await onCreateTrip(newTrip)

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="flex h-screen items-center justify-center bg-pattern bg-center bg-no-repeat">
      <div className="w-full max-w-3xl space-y-10 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />

          <p className="text-lg text-zinc-300">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda{' '}
          <br />
          com nossos{' '}
          <a href="#" className="text-zinc-300 underline">
            termos de uso
          </a>{' '}
          e{' '}
          <a href="#" className="text-zinc-300 underline">
            políticas de privacidade
          </a>
          .
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestsModal={closeGuestsModal}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          createTrip={handleCrateTrip}
        />
      )}
    </div>
  )
}
