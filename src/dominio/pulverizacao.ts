import type { AvaliacaoPulverizacao, CondicoesPulverizacao } from '../tipos'

/** A3: cinco condições; cada uma que falha gera um motivo. */
export function avaliarPulverizacao(c: CondicoesPulverizacao): AvaliacaoPulverizacao {
  const motivos: string[] = []

  if (c.vento > 10) motivos.push('Vento acima de 10 km/h, risco de deriva')
  else if (c.vento < 3) motivos.push('Vento abaixo de 3 km/h, risco de inversão térmica')

  if (c.temperatura >= 30) motivos.push('Temperatura de 30 °C ou mais')
  if (c.umidade < 55) motivos.push('Umidade abaixo de 55%')
  if (c.precipitacao > 0) motivos.push('Chovendo agora')
  if (c.probabilidadeChuva >= 50) {
    motivos.push(`Chuva provável hoje (${Math.round(c.probabilidadeChuva)}%)`)
  }

  const nivel = motivos.length === 0 ? 'favoravel' : motivos.length === 1 ? 'atencao' : 'desfavoravel'
  return { nivel, motivos }
}

export const NOMES_NIVEL = {
  favoravel: 'Favorável',
  atencao: 'Atenção',
  desfavoravel: 'Desfavorável',
} as const
