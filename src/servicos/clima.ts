import type { Clima, ClimaAtual, Municipio, PrevisaoDia } from '../tipos'

const URL_BASE = 'https://api.open-meteo.com/v1/forecast'

export function montarUrlClima(municipio: Municipio): string {
  const parametros = new URLSearchParams({
    latitude: String(municipio.latitude),
    longitude: String(municipio.longitude),
    current:
      'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'America/Fortaleza',
    forecast_days: '7',
  })
  return `${URL_BASE}?${parametros.toString()}`
}

type Registro = Record<string, unknown>

function ehRegistro(valor: unknown): valor is Registro {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function numero(valor: unknown): number | null {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : null
}

function lista(valor: unknown): unknown[] {
  return Array.isArray(valor) ? valor : []
}

const ERRO_FORMATO = 'O serviço de clima respondeu em um formato inesperado.'

/**
 * Converte a resposta crua da Open-Meteo.
 * `daily` vem em arrays paralelos: a posição 0 de cada array é o primeiro dia.
 */
export function converterResposta(dados: unknown): Clima {
  if (!ehRegistro(dados) || !ehRegistro(dados.current)) throw new Error(ERRO_FORMATO)

  const c = dados.current
  const temperatura = numero(c.temperature_2m)
  const umidade = numero(c.relative_humidity_2m)
  const precipitacao = numero(c.precipitation)
  const vento = numero(c.wind_speed_10m)
  const codigo = numero(c.weather_code)
  if (
    temperatura === null ||
    umidade === null ||
    precipitacao === null ||
    vento === null ||
    codigo === null
  ) {
    throw new Error(ERRO_FORMATO)
  }
  const atual: ClimaAtual = { temperatura, umidade, precipitacao, vento, codigo }

  const dias: PrevisaoDia[] = []
  if (ehRegistro(dados.daily)) {
    const d = dados.daily
    const datas = lista(d.time)
    const codigos = lista(d.weather_code)
    const maximas = lista(d.temperature_2m_max)
    const minimas = lista(d.temperature_2m_min)
    const chuvas = lista(d.precipitation_sum)
    const probabilidades = lista(d.precipitation_probability_max)

    datas.forEach((data, i) => {
      const maxima = numero(maximas[i])
      const minima = numero(minimas[i])
      if (typeof data !== 'string' || maxima === null || minima === null) return
      dias.push({
        data,
        codigo: numero(codigos[i]) ?? -1,
        maxima,
        minima,
        chuvaMm: numero(chuvas[i]) ?? 0,
        probabilidadeChuva: numero(probabilidades[i]) ?? 0,
      })
    })
  }

  return { atual, dias }
}

/** Busca o clima do município. Cancelável por `signal` (veja o hook useClima). */
export async function buscarClima(municipio: Municipio, signal: AbortSignal): Promise<Clima> {
  let resposta: Response
  try {
    resposta = await fetch(montarUrlClima(municipio), { signal })
  } catch (erro) {
    if (signal.aborted) throw erro
    throw new Error('Não foi possível carregar o clima. Verifique sua conexão com a internet.')
  }

  if (!resposta.ok) {
    throw new Error(`O serviço de clima não respondeu (código ${resposta.status}).`)
  }

  const dados: unknown = await resposta.json()
  return converterResposta(dados)
}
