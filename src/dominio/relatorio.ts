import type { Operacao, Relatorio, Talhao } from '../tipos'
import { formatarNumero } from './dinheiro'
import { CULTURAS, NOMES_CULTURA } from './talhao'

/** A6.4: produção = produtividade × área, arredondada para a saca inteira. */
export function calcularProducao(produtividadeScHa: number, areaHa: number): number {
  return Math.round(produtividadeScHa * areaHa)
}

/** A7: soma dos custos dividida pela área, arredondada para o centavo. */
export function custoPorHectare(custoTotalCentavos: number, areaHa: number): number {
  return Math.round(custoTotalCentavos / areaHa)
}

export function producaoDoTalhao(talhao: Talhao, operacoes: Operacao[]): number | null {
  const colheita = operacoes.find((o) => o.talhaoId === talhao.id && o.tipo === 'colheita')
  if (!colheita || colheita.produtividadeScHa === undefined) return null
  return calcularProducao(colheita.produtividadeScHa, talhao.areaHa)
}

export function custoTotalDoTalhao(talhaoId: string, operacoes: Operacao[]): number {
  return operacoes
    .filter((o) => o.talhaoId === talhaoId)
    .reduce((soma, o) => soma + o.custoCentavos, 0)
}

/** A7: relatório da safra. */
export function gerarRelatorio(talhoes: Talhao[], operacoes: Operacao[]): Relatorio {
  const areaPorCultura = CULTURAS.map((cultura) => ({
    cultura,
    areaHa:
      Math.round(
        talhoes.filter((t) => t.cultura === cultura).reduce((s, t) => s + t.areaHa, 0) * 100,
      ) / 100,
  })).filter((a) => a.areaHa > 0)

  const linhas = talhoes.map((t) => {
    const custoTotalCentavos = custoTotalDoTalhao(t.id, operacoes)
    return {
      talhaoId: t.id,
      nome: t.nome,
      cultura: t.cultura,
      areaHa: t.areaHa,
      custoTotalCentavos,
      custoPorHaCentavos: custoPorHectare(custoTotalCentavos, t.areaHa),
      producaoSacas: producaoDoTalhao(t, operacoes),
    }
  })

  return {
    areaPorCultura,
    linhas,
    custoTotalCentavos: linhas.reduce((s, l) => s + l.custoTotalCentavos, 0),
    producaoTotalSacas: linhas.reduce((s, l) => s + (l.producaoSacas ?? 0), 0),
  }
}

function celula(texto: string): string {
  return `"${texto.replace(/"/g, '""')}"`
}

/** Diferencial: relatório em CSV (separador ';', decimal com vírgula, abre direto no Excel BR). */
export function relatorioParaCsv(relatorio: Relatorio): string {
  const linhas: string[] = [
    ['Talhão', 'Cultura', 'Área (ha)', 'Custo total (R$)', 'Custo por ha (R$)', 'Produção (sacas)']
      .map(celula)
      .join(';'),
  ]
  for (const l of relatorio.linhas) {
    linhas.push(
      [
        celula(l.nome),
        celula(NOMES_CULTURA[l.cultura]),
        formatarNumero(l.areaHa, 2),
        formatarNumero(l.custoTotalCentavos / 100, 2),
        formatarNumero(l.custoPorHaCentavos / 100, 2),
        l.producaoSacas === null ? '' : String(l.producaoSacas),
      ].join(';'),
    )
  }
  linhas.push(
    [
      celula('Total'),
      '',
      '',
      formatarNumero(relatorio.custoTotalCentavos / 100, 2),
      '',
      String(relatorio.producaoTotalSacas),
    ].join(';'),
  )
  return linhas.join('\r\n')
}
