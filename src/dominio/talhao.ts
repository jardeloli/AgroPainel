import type {
  Cultura,
  Operacao,
  ResumoTalhao,
  SituacaoTalhao,
  Talhao,
} from '../tipos'
import { diasEntre, somarDias } from './datas'

export const CICLO_DIAS: Record<Cultura, number> = {
  soja: 120,
  milho: 140,
  algodao: 180,
  arroz: 120,
  feijao: 90,
}

export const NOMES_CULTURA: Record<Cultura, string> = {
  soja: 'Soja',
  milho: 'Milho',
  algodao: 'Algodão',
  arroz: 'Arroz',
  feijao: 'Feijão',
}

export const CULTURAS: Cultura[] = ['soja', 'milho', 'algodao', 'arroz', 'feijao']

export const NOMES_SITUACAO: Record<SituacaoTalhao, string> = {
  colhido: 'Colhido',
  'aguardando-plantio': 'Aguardando plantio',
  'em-desenvolvimento': 'Em desenvolvimento',
  'colheita-proxima': 'Colheita próxima',
  'ponto-de-colheita': 'Ponto de colheita',
}

export const SITUACOES: SituacaoTalhao[] = [
  'aguardando-plantio',
  'em-desenvolvimento',
  'colheita-proxima',
  'ponto-de-colheita',
  'colhido',
]

/** A1: previsão de colheita = data de plantio + ciclo da cultura. */
export function preverColheita(cultura: Cultura, dataPlantio: string): string {
  return somarDias(dataPlantio, CICLO_DIAS[cultura])
}

export function diasDesdePlantio(dataPlantio: string, hoje: string): number {
  return diasEntre(dataPlantio, hoje)
}

export function temColheita(talhaoId: string, operacoes: Operacao[]): boolean {
  return operacoes.some((o) => o.talhaoId === talhaoId && o.tipo === 'colheita')
}

/** A2: situação do talhão, avaliada nesta ordem a partir de `hoje`. */
export function calcularSituacao(
  talhao: Talhao,
  operacoes: Operacao[],
  hoje: string,
): SituacaoTalhao {
  if (temColheita(talhao.id, operacoes)) return 'colhido'
  if (talhao.dataPlantio === null) return 'aguardando-plantio'

  const ciclo = CICLO_DIAS[talhao.cultura]
  const dias = diasDesdePlantio(talhao.dataPlantio, hoje)
  if (dias < ciclo - 15) return 'em-desenvolvimento'
  if (dias < ciclo) return 'colheita-proxima' // entre ciclo - 15 e ciclo - 1
  return 'ponto-de-colheita'
}

export function resumirTalhao(
  talhao: Talhao,
  operacoes: Operacao[],
  hoje: string,
): ResumoTalhao {
  const plantado = talhao.dataPlantio !== null
  return {
    talhao,
    situacao: calcularSituacao(talhao, operacoes, hoje),
    diasDesdePlantio: plantado ? diasDesdePlantio(talhao.dataPlantio as string, hoje) : null,
    previsaoColheita: plantado
      ? preverColheita(talhao.cultura, talhao.dataPlantio as string)
      : null,
  }
}

/** Próximas colheitas: talhões plantados e ainda não colhidos, da previsão mais próxima. */
export function proximasColheitas(resumos: ResumoTalhao[], quantidade = 3): ResumoTalhao[] {
  return resumos
    .filter((r) => r.situacao !== 'colhido' && r.previsaoColheita !== null)
    .sort((a, b) => (a.previsaoColheita as string).localeCompare(b.previsaoColheita as string))
    .slice(0, quantidade)
}

export function areaTotal(talhoes: Talhao[]): number {
  return talhoes.reduce((soma, t) => soma + t.areaHa, 0)
}

export interface FiltrosTalhoes {
  cultura: Cultura | 'todas'
  situacao: SituacaoTalhao | 'todas'
  busca: string
}

export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function filtrarResumos(resumos: ResumoTalhao[], filtros: FiltrosTalhoes): ResumoTalhao[] {
  const busca = normalizarTexto(filtros.busca)
  return resumos.filter(
    (r) =>
      (filtros.cultura === 'todas' || r.talhao.cultura === filtros.cultura) &&
      (filtros.situacao === 'todas' || r.situacao === filtros.situacao) &&
      (busca === '' || normalizarTexto(r.talhao.nome).includes(busca)),
  )
}

export function ordenarOperacoes(operacoes: Operacao[]): Operacao[] {
  // sort é estável: operações do mesmo dia mantêm a ordem de registro
  return [...operacoes].sort((a, b) => a.data.localeCompare(b.data))
}

/** Texto curto sobre quanto falta (ou quanto passou) para a previsão de colheita. */
export function descreverPrazoColheita(previsao: string, hoje: string): string {
  const dias = diasEntre(hoje, previsao)
  if (dias === 0) return 'é hoje'
  const unidade = Math.abs(dias) === 1 ? 'dia' : 'dias'
  return dias > 0 ? `faltam ${dias} ${unidade}` : `passou há ${-dias} ${unidade}`
}
