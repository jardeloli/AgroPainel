import type { Operacao, Talhao } from '../tipos'
import type { DadosPersistidos } from '../servicos/armazenamento'

export type Acao =
  | { tipo: 'adicionar-talhao'; talhao: Talhao }
  | { tipo: 'atualizar-talhao'; talhao: Talhao }
  | { tipo: 'remover-talhao'; id: string }
  | { tipo: 'adicionar-operacao'; operacao: Operacao }
  | { tipo: 'remover-operacao'; id: string }
  | { tipo: 'definir-municipio'; id: string }

export function reducer(estado: DadosPersistidos, acao: Acao): DadosPersistidos {
  switch (acao.tipo) {
    case 'adicionar-talhao':
      return { ...estado, talhoes: [...estado.talhoes, acao.talhao] }
    case 'atualizar-talhao':
      return {
        ...estado,
        talhoes: estado.talhoes.map((t) => (t.id === acao.talhao.id ? acao.talhao : t)),
      }
    case 'remover-talhao':
      return {
        ...estado,
        talhoes: estado.talhoes.filter((t) => t.id !== acao.id),
        operacoes: estado.operacoes.filter((o) => o.talhaoId !== acao.id),
      }
    case 'adicionar-operacao':
      return { ...estado, operacoes: [...estado.operacoes, acao.operacao] }
    case 'remover-operacao':
      return { ...estado, operacoes: estado.operacoes.filter((o) => o.id !== acao.id) }
    case 'definir-municipio':
      return { ...estado, municipioId: acao.id }
  }
}
