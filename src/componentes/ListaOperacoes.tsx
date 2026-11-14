import { NOMES_OPERACAO, calcularProducao, formatarData, formatarNumero, formatarReais, ordenarOperacoes } from '../dominio'
import type { Operacao, Talhao } from '../tipos'
import { EstadoVazio } from './EstadoVazio'

interface Props {
  talhao: Talhao
  operacoes: Operacao[]
  onRemover: (operacao: Operacao) => void
}

export function ListaOperacoes({ talhao, operacoes, onRemover }: Props) {
  if (operacoes.length === 0) {
    return (
      <EstadoVazio titulo="Nenhuma operação registrada">
        <p>Use o formulário abaixo para registrar o preparo, o plantio, as aplicações e a colheita.</p>
      </EstadoVazio>
    )
  }

  return (
    <ol className="diario">
      {ordenarOperacoes(operacoes).map((o) => (
        <li key={o.id} className="diario__item">
          <time className="diario__data" dateTime={o.data}>
            {formatarData(o.data)}
          </time>
          <div className="diario__corpo">
            <p className="diario__tipo">{NOMES_OPERACAO[o.tipo]}</p>
            <p>{o.descricao}</p>
            {o.tipo === 'colheita' && o.produtividadeScHa !== undefined && (
              <p>
                {formatarNumero(o.produtividadeScHa, 1)} sc/ha, produção de{' '}
                <strong>
                  {formatarNumero(calcularProducao(o.produtividadeScHa, talhao.areaHa))} sacas
                </strong>
              </p>
            )}
          </div>
          <p className="diario__custo">{formatarReais(o.custoCentavos)}</p>
          <button
            type="button"
            className="botao botao--texto"
            onClick={() => onRemover(o)}
            aria-label={`Remover ${NOMES_OPERACAO[o.tipo]} de ${formatarData(o.data)}`}
          >
            Remover
          </button>
        </li>
      ))}
    </ol>
  )
}
