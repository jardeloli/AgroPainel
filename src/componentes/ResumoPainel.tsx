import { Link } from 'react-router-dom'
import { formatarData, formatarNumero } from '../dominio'
import type { ResumoTalhao } from '../tipos'
import { EstadoVazio } from './EstadoVazio'
import { SeloSituacao } from './SeloSituacao'

interface Props {
  areaTotalHa: number
  totalTalhoes: number
  proximas: ResumoTalhao[]
}

export function ResumoPainel({ areaTotalHa, totalTalhoes, proximas }: Props) {
  return (
    <section className="cartao" aria-labelledby="titulo-resumo">
      <h2 id="titulo-resumo">Resumo da fazenda</h2>
      <dl className="medidas medidas--duas">
        <div>
          <dt>Área total</dt>
          <dd>{formatarNumero(areaTotalHa, 2)} ha</dd>
        </div>
        <div>
          <dt>Talhões</dt>
          <dd>{totalTalhoes}</dd>
        </div>
      </dl>

      <h3>Próximas colheitas</h3>
      {proximas.length === 0 ? (
        <EstadoVazio titulo="Nenhuma colheita prevista">
          <p>
            {totalTalhoes === 0
              ? 'Cadastre seu primeiro talhão para acompanhar as lavouras.'
              : 'Informe a data de plantio dos talhões para ver as previsões.'}
          </p>
          <Link to={totalTalhoes === 0 ? '/talhoes/novo' : '/talhoes'} className="botao">
            {totalTalhoes === 0 ? 'Cadastrar talhão' : 'Ver talhões'}
          </Link>
        </EstadoVazio>
      ) : (
        <ol className="lista-simples">
          {proximas.map((r) => (
            <li key={r.talhao.id}>
              <Link to={`/talhoes/${r.talhao.id}`}>{r.talhao.nome}</Link>
              <span className="lista-simples__info">
                {r.previsaoColheita !== null && formatarData(r.previsaoColheita)}
              </span>
              <SeloSituacao situacao={r.situacao} />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
