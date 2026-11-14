import { NOMES_SITUACAO } from '../dominio'
import type { SituacaoTalhao } from '../tipos'

export function SeloSituacao({ situacao }: { situacao: SituacaoTalhao }) {
  return <span className={`selo selo--${situacao}`}>{NOMES_SITUACAO[situacao]}</span>
}
