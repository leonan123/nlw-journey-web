import { MapPin, Calendar, Settings2, ArrowRight, X } from 'lucide-react'
import { Button } from '../../../components/button'
import {
  useState,
  type ChangeEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import classNames from 'react-day-picker/style.module.css'
import { formatRangeDateToDisplay } from '../../../helpers/format-range-date-to-display'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { usePlacesWidget } from 'react-google-autocomplete'

interface DestinationAndDateStepProps {
  isGuestsInputOpen: boolean
  eventStartAndEndDates: DateRange | undefined
  closeGuestsInput: () => void
  openGuestsInput: () => void
  setDestination: (destination: string) => void
  setEventStartAndEndDates: (dates: DateRange | undefined) => void
}

export function DestinationAndDateStep({
  isGuestsInputOpen,
  closeGuestsInput,
  openGuestsInput,
  setDestination,
  setEventStartAndEndDates,
  eventStartAndEndDates,
}: DestinationAndDateStepProps) {
  const { getPlacePredictions } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const { ref } = usePlacesWidget({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }

  function closeDatePicker(ev: MouseEvent<HTMLElement>) {
    const target = ev.target as HTMLElement

    if (target.dataset.canCloseModal === 'true') {
      setIsDatePickerOpen(false)
    }
  }

  function handleDestinationChange(ev: ChangeEvent<HTMLInputElement>) {
    getPlacePredictions({
      input: ev.target.value,
    })
    setDestination(ev.target.value)
  }

  const displayedDate = formatRangeDateToDisplay(
    eventStartAndEndDates?.from?.toString(),
    eventStartAndEndDates?.to?.toString(),
  )

  return (
    <>
      <div className="flex h-16 items-center gap-3 rounded-xl bg-zinc-900 px-4 shadow-shape">
        <div className="flex flex-1 items-center gap-2">
          <MapPin className="size-5 text-zinc-400" />
          <input
            ref={ref as unknown as RefObject<HTMLInputElement>}
            type="text"
            placeholder="Para onde você vai?"
            className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
            disabled={!!isGuestsInputOpen}
            onChange={handleDestinationChange}
          />
        </div>

        <button
          className="flex min-w-40 items-center gap-2 bg-transparent text-left"
          disabled={!!isGuestsInputOpen}
          onClick={openDatePicker}
        >
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-lg text-zinc-400">
            {displayedDate || 'Quando?'}
          </span>
        </button>

        {isDatePickerOpen && (
          <div
            className="fixed inset-0 grid place-items-center bg-black/60"
            onClick={closeDatePicker}
            data-can-close-modal={true}
          >
            <div className="space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Selecione a data</h2>

                  <button
                    type="button"
                    onClick={closeDatePicker}
                    className="[&>*]:pointer-events-none"
                    data-can-close-modal={true}
                  >
                    <X className="size-5 text-zinc-400" />
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>

              <DayPicker
                mode="range"
                selected={eventStartAndEndDates}
                onSelect={setEventStartAndEndDates}
                classNames={{
                  ...classNames,
                  today: `text-lime-400`,
                  selected: `bg-lime-400 border-none text-lime-950`,
                  chevron: `${classNames.chevron} fill-zinc-100`,
                  range_start: `${classNames.range_start} bg-none bg-transparent [&>button]:rounded-none`,
                  range_end: `${classNames.range_end} bg-none bg-transparent [&>button]:rounded-none`,
                }}
              />
            </div>
          </div>
        )}

        <div className="h-6 w-px bg-zinc-800" />

        {isGuestsInputOpen ? (
          <Button variant="secondary" onClick={closeGuestsInput}>
            Alterar local/data
            <Settings2 className="size-5" />
          </Button>
        ) : (
          <Button onClick={openGuestsInput}>
            Continuar
            <ArrowRight className="size-5" />
          </Button>
        )}
      </div>
    </>
  )
}
