/** Dinheiro: informado em reais, guardado em centavos inteiros. */

export function reaisParaCentavos(reais: number): number {
  return Math.round(reais * 100)
}

export function formatarReais(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    centavos / 100,
  )
}

/**
 * Lê um número digitado por brasileiro.
 * "1.250,50" -> 1250.5 | "1250,5" -> 1250.5 | "1250.5" -> 1250.5
 * Devolve null se o texto não for um número.
 */
export function lerNumero(texto: string): number | null {
  const t = texto.trim().replace(/\s/g, '')
  if (t === '') return null
  const normalizado = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t
  if (!/^-?\d+(\.\d+)?$/.test(normalizado)) return null
  const n = Number(normalizado)
  return Number.isFinite(n) ? n : null
}

export function formatarNumero(n: number, casas = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(n)
}
