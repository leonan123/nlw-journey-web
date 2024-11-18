import { Link2, Loader2, Plus, Tag, X } from 'lucide-react'
import { Button } from '../../components/button'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { redirect, useParams } from 'react-router-dom'
import { createLink } from '../../http/create-link'
import { getImportantLinks } from '../../http/get-important-links'

export function ImportantLinks() {
  const queryClient = useQueryClient()
  const { tripId } = useParams()

  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false)

  if (!tripId) {
    redirect('/')
  }

  const { data: links } = useQuery({
    queryKey: ['links'],
    queryFn: async () => getImportantLinks({ tripId: tripId as string }),
  })

  const { mutateAsync: onAddLink, isPending: isAddingLink } = useMutation({
    mutationFn: createLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['links'] }),
  })

  function handleAddLink(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    const formData = new FormData(ev.currentTarget)

    const addLinkSchema = z.object({
      title: z.string().min(1),
      url: z.string().min(1),
      tripId: z.string().min(1).uuid(),
    })

    const { error, data: newLink } = addLinkSchema.safeParse({
      ...Object.fromEntries(formData),
      tripId,
    })

    if (error) {
      return
    }

    onAddLink(newLink)
    setIsAddLinkModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Links importantes</h2>

      <div className="space-y-5">
        {links && links.length ? (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-8"
            >
              <div className="space-y-1.5">
                <h3 className="font-medium text-zinc-100">{link.title}</h3>
                <a
                  className="inline-block w-full truncate text-xs text-zinc-400 hover:text-zinc-200"
                  href={link.url}
                >
                  {link.url}
                </a>
              </div>

              <button onClick={() => window.open(link.url, '_blank')}>
                <Link2 className="size-5 shrink-0 text-zinc-400" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-sm text-zinc-400">Nenhum link encontrado</span>
        )}
      </div>

      <Dialog.Root
        open={isAddLinkModalOpen}
        onOpenChange={setIsAddLinkModalOpen}
      >
        <Dialog.Trigger asChild>
          <Button variant="secondary" size="full">
            <Plus className="size-5" />
            Cadastrar novo link
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 grid place-items-center bg-black/60" />

          <Dialog.Content className="fixed left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
            <div className="space-y-2">
              <Dialog.Title className="text-lg font-semibold">
                Cadastrar link
              </Dialog.Title>

              <Dialog.Description className="text-sm text-zinc-400">
                Todos convidados podem visualizar os links importantes.
              </Dialog.Description>
            </div>

            <form className="space-y-3" onSubmit={handleAddLink}>
              <div className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 px-4">
                <Tag className="size-5 text-zinc-400" />

                <input
                  name="title"
                  required
                  placeholder="Título do link"
                  className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>

              <div className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 px-4">
                <Link2 className="size-5 text-zinc-400" />

                <input
                  name="url"
                  type="url"
                  required
                  placeholder="URL"
                  className="w-full bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>

              <Button type="submit" size="full" disabled={isAddingLink}>
                {isAddingLink ? (
                  <Loader2 className="size-5 animate-spin text-lime-950" />
                ) : (
                  <>Salvar link</>
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
