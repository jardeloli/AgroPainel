import { Link } from 'react-router-dom'
import { NOMES_CULTURA, formatarData, formatarNumero } from '../dominio'
import type { ResumoTalhao } from '../tipos'
import { SeloSituacao } from './SeloSituacao'

export function CartaoTalhao({ resumo }: { resumo: ResumoTalhao }) {
  const { talhao, situacao, previsaoColheita } = resumo

  return (
    <article className="cartao cartao-talhao">
      <div className="cartao-talhao__topo">
        <h3>
          <Link to={`/talhoes/${talhao.id}`}>{talhao.nome}</Link>
        </h3>
        <SeloSituacao situacao={situacao} />
      </div>
      <dl className="dados">
        <div>
          <dt>Cultura</dt>
          <dd>{NOMES_CULTURA[talhao.cultura]}</dd>
        </div>
        <div>
          <dt>Área</dt>
          <dd>{formatarNumero(talhao.areaHa, 2)} ha</dd>
        </div>
        <div>
          <dt>Colheita prevista</dt>
          <dd>
            {previsaoColheita !== null
              ? formatarData(previsaoColheita)
              : 'Sem previsão, falta plantar'}
          </dd>
        </div>
      </dl>
    </article>
  )
}
