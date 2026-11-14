import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { lerDados, salvarDados } from '../servicos/armazenamento'
import { reducer } from './reducer'
import { TalhoesContexto, type TalhoesContextoValor } from './talhoesContexto'

export function TalhoesProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, undefined, lerDados)

  // RC09: toda mudança é gravada no localStorage
  useEffect(() => {
    salvarDados(estado)
  }, [estado])

  const valor = useMemo<TalhoesContextoValor>(
    () => ({
      talhoes: estado.talhoes,
      operacoes: estado.operacoes,
      municipioId: estado.municipioId,
      adicionarTalhao: (talhao) => dispatch({ tipo: 'adicionar-talhao', talhao }),
      atualizarTalhao: (talhao) => dispatch({ tipo: 'atualizar-talhao', talhao }),
      removerTalhao: (id) => dispatch({ tipo: 'remover-talhao', id }),
      adicionarOperacao: (operacao) => dispatch({ tipo: 'adicionar-operacao', operacao }),
      removerOperacao: (id) => dispatch({ tipo: 'remover-operacao', id }),
      definirMunicipio: (id) => dispatch({ tipo: 'definir-municipio', id }),
    }),
    [estado],
  )

  return <TalhoesContexto.Provider value={valor}>{children}</TalhoesContexto.Provider>
}
