import { createContext } from 'react'
import type { Operacao, Talhao } from '../tipos'

export interface TalhoesContextoValor {
  talhoes: Talhao[]
  operacoes: Operacao[]
  municipioId: string
  adicionarTalhao: (talhao: Talhao) => void
  atualizarTalhao: (talhao: Talhao) => void
  removerTalhao: (id: string) => void
  adicionarOperacao: (operacao: Operacao) => void
  removerOperacao: (id: string) => void
  definirMunicipio: (id: string) => void
}

export const TalhoesContexto = createContext<TalhoesContextoValor | null>(null)
