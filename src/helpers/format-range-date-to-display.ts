import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatRangeDateToDisplay(from?: string, to?: string) {
  return from && to
    ? format(from, "dd' de 'LLL", { locale: ptBR })
        .concat(' até ')
        .concat(format(to, "dd' de 'LLL"))
    : null
}
