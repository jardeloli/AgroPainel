/**
 * Datas do domínio são sempre texto 'AAAA-MM-DD'.
 * Toda a conta é feita em UTC dos dois lados, para nunca cair na
 * armadilha do fuso (new Date('2026-10-01') vira 30/09 às 21h em Balsas).
 */

const MS_POR_DIA = 24 * 60 * 60 * 1000

interface PartesData {
  ano: number
  mes: number
  dia: number
}

export function lerData(iso: string): PartesData | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const ano = Number(m[1])
  const mes = Number(m[2])
  const dia = Number(m[3])
  const d = new Date(Date.UTC(ano, mes - 1, dia))
  const confere =
    d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia
  return confere ? { ano, mes, dia } : null
}

export function dataValida(iso: string): boolean {
  return lerData(iso) !== null
}

function paraUtc(iso: string): number {
  const p = lerData(iso)
  if (!p) throw new Error(`Data inválida: ${iso}`)
  return Date.UTC(p.ano, p.mes - 1, p.dia)
}

/** Dias de `inicio` até `fim` (negativo se `fim` for anterior). */
export function diasEntre(inicio: string, fim: string): number {
  return Math.round((paraUtc(fim) - paraUtc(inicio)) / MS_POR_DIA)
}

export function somarDias(iso: string, dias: number): string {
  return new Date(paraUtc(iso) + dias * MS_POR_DIA).toISOString().slice(0, 10)
}

/** Converte um Date (instante local) para 'AAAA-MM-DD' usando o calendário local. */
export function paraIsoLocal(d: Date): string {
  const ano = String(d.getFullYear()).padStart(4, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function formatarData(iso: string): string {
  const p = lerData(iso)
  if (!p) return iso
  return `${String(p.dia).padStart(2, '0')}/${String(p.mes).padStart(2, '0')}/${p.ano}`
}

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export function diaDaSemana(iso: string): string {
  return DIAS_SEMANA[new Date(paraUtc(iso)).getUTCDay()]
}
