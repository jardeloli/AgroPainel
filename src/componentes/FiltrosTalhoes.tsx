import { CULTURAS, NOMES_CULTURA, NOMES_SITUACAO, SITUACOES, type FiltrosTalhoes as Filtros } from '../dominio'
import type { Cultura, SituacaoTalhao } from '../tipos'
import { CampoSelecao } from './CampoSelecao'
import { CampoTexto } from './CampoTexto'

interface Props {
  filtros: Filtros
  onAlterar: (filtros: Filtros) => void
}

export function FiltrosTalhoes({ filtros, onAlterar }: Props) {
  return (
    <form className="filtros" role="search" aria-label="Filtrar talhões" onSubmit={(e) => e.preventDefault()}>
      <CampoTexto
        id="filtro-busca"
        rotulo="Buscar pelo nome"
        tipo="search"
        valor={filtros.busca}
        onAlterar={(busca) => onAlterar({ ...filtros, busca })}
      />
      <CampoSelecao
        id="filtro-cultura"
        rotulo="Cultura"
        valor={filtros.cultura}
        onAlterar={(v) => onAlterar({ ...filtros, cultura: v as Cultura | 'todas' })}
        opcoes={[
          { valor: 'todas', rotulo: 'Todas' },
          ...CULTURAS.map((c) => ({ valor: c, rotulo: NOMES_CULTURA[c] })),
        ]}
      />
      <CampoSelecao
        id="filtro-situacao"
        rotulo="Situação"
        valor={filtros.situacao}
        onAlterar={(v) => onAlterar({ ...filtros, situacao: v as SituacaoTalhao | 'todas' })}
        opcoes={[
          { valor: 'todas', rotulo: 'Todas' },
          ...SITUACOES.map((s) => ({ valor: s, rotulo: NOMES_SITUACAO[s] })),
        ]}
      />
    </form>
  )
}
