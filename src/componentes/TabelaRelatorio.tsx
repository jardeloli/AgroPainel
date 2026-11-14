import { NOMES_CULTURA, formatarNumero, formatarReais } from '../dominio'
import type { Relatorio } from '../tipos'

export function TabelaRelatorio({ relatorio }: { relatorio: Relatorio }) {
  return (
    <div className="tabela-rolavel" role="region" aria-label="Custos e produção por talhão" tabIndex={0}>
      <table className="tabela">
        <thead>
          <tr>
            <th scope="col">Talhão</th>
            <th scope="col">Cultura</th>
            <th scope="col" className="num">Área (ha)</th>
            <th scope="col" className="num">Custo total</th>
            <th scope="col" className="num">Custo por ha</th>
            <th scope="col" className="num">Produção (sacas)</th>
          </tr>
        </thead>
        <tbody>
          {relatorio.linhas.map((l) => (
            <tr key={l.talhaoId}>
              <th scope="row">{l.nome}</th>
              <td>{NOMES_CULTURA[l.cultura]}</td>
              <td className="num">{formatarNumero(l.areaHa, 2)}</td>
              <td className="num">{formatarReais(l.custoTotalCentavos)}</td>
              <td className="num">{formatarReais(l.custoPorHaCentavos)}</td>
              <td className="num">
                {l.producaoSacas === null ? <span aria-label="sem colheita">–</span> : formatarNumero(l.producaoSacas)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={3}>Total da safra</th>
            <td className="num">{formatarReais(relatorio.custoTotalCentavos)}</td>
            <td />
            <td className="num">{formatarNumero(relatorio.producaoTotalSacas)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
