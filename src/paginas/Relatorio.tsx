import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { TabelaRelatorio } from '../componentes/TabelaRelatorio'
import {
  NOMES_CULTURA,
  areaTotal,
  formatarNumero,
  formatarReais,
  gerarRelatorio,
  relatorioParaCsv,
} from '../dominio'
import { useTalhoes } from '../hooks/useTalhoes'
import { useTitulo } from '../hooks/useTitulo'
import { baixarCsv } from '../servicos/exportacao'

export function Relatorio() {
  useTitulo('Relatório da safra')
  const { talhoes, operacoes } = useTalhoes()
  const relatorio = useMemo(() => gerarRelatorio(talhoes, operacoes), [talhoes, operacoes])

  if (talhoes.length === 0) {
    return (
      <>
        <h1>Relatório da safra</h1>
        <EstadoVazio titulo="Ainda não há dados para o relatório">
          <p>Cadastre talhões e registre as operações para ver custos e produção.</p>
          <Link to="/talhoes/novo" className="botao">
            Cadastrar talhão
          </Link>
        </EstadoVazio>
      </>
    )
  }

  const maiorArea = Math.max(...relatorio.areaPorCultura.map((a) => a.areaHa))

  return (
    <>
      <div className="pagina-topo">
        <h1>Relatório da safra</h1>
        <button
          type="button"
          className="botao botao--secundario"
          onClick={() => baixarCsv('relatorio-safra.csv', relatorioParaCsv(relatorio))}
        >
          Exportar CSV
        </button>
      </div>

      <dl className="medidas medidas--cartoes">
        <div>
          <dt>Área total</dt>
          <dd>{formatarNumero(areaTotal(talhoes), 2)} ha</dd>
        </div>
        <div>
          <dt>Custo total da safra</dt>
          <dd>{formatarReais(relatorio.custoTotalCentavos)}</dd>
        </div>
        <div>
          <dt>Produção colhida</dt>
          <dd>{formatarNumero(relatorio.producaoTotalSacas)} sacas</dd>
        </div>
      </dl>

      <section className="cartao secao" aria-labelledby="titulo-area-cultura">
        <h2 id="titulo-area-cultura">Área por cultura</h2>
        <ul className="barras">
          {relatorio.areaPorCultura.map((a) => (
            <li key={a.cultura}>
              <span className="barras__nome">{NOMES_CULTURA[a.cultura]}</span>
              <span className="barras__trilho" aria-hidden="true">
                <span className="barras__valor" style={{ width: `${(a.areaHa / maiorArea) * 100}%` }} />
              </span>
              <span className="barras__numero">{formatarNumero(a.areaHa, 2)} ha</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="secao" aria-labelledby="titulo-por-talhao">
        <h2 id="titulo-por-talhao">Custo e produção por talhão</h2>
        <TabelaRelatorio relatorio={relatorio} />
      </section>
    </>
  )
}
