import { useContext } from 'react'
import { TalhoesContexto, type TalhoesContextoValor } from '../contexto/talhoesContexto'

/** RC05: acesso ao estado compartilhado (talhões, operações, município). */
export function useTalhoes(): TalhoesContextoValor {
  const contexto = useContext(TalhoesContexto)
  if (contexto === null) {
    throw new Error('useTalhoes precisa estar dentro de <TalhoesProvider>.')
  }
  return contexto
}
