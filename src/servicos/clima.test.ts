import { describe, expect, it } from 'vitest'
import { MUNICIPIOS } from '../dados/municipios'
import { converterResposta, montarUrlClima } from './clima'

const resposta = {
  current: {
    temperature_2m: 27.4,
    relative_humidity_2m: 70,
    precipitation: 0,
    wind_speed_10m: 6.1,
    weather_code: 2,
  },
  daily: {
    time: ['2026-11-09', '2026-11-10'],
    weather_code: [2, 61],
    temperature_2m_max: [32, 29],
    temperature_2m_min: [22, 21],
    precipitation_sum: [0, 8.2],
    precipitation_probability_max: [20, null],
  },
}

describe('serviço de clima', () => {
  it('monta o endereço com os parâmetros do enunciado', () => {
    const url = new URL(montarUrlClima(MUNICIPIOS[0]))
    expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast')
    expect(url.searchParams.get('latitude')).toBe('-7.5325')
    expect(url.searchParams.get('longitude')).toBe('-46.0356')
    expect(url.searchParams.get('timezone')).toBe('America/Fortaleza')
    expect(url.searchParams.get('forecast_days')).toBe('7')
  })

  it('converte arrays paralelos em dias', () => {
    const clima = converterResposta(resposta)
    expect(clima.atual.vento).toBe(6.1)
    expect(clima.dias).toHaveLength(2)
    expect(clima.dias[0]).toMatchObject({ data: '2026-11-09', maxima: 32, probabilidadeChuva: 20 })
    expect(clima.dias[1]).toMatchObject({ codigo: 61, chuvaMm: 8.2, probabilidadeChuva: 0 })
  })

  it('recusa respostas fora do formato', () => {
    expect(() => converterResposta(null)).toThrow()
    expect(() => converterResposta({ current: { temperature_2m: 20 } })).toThrow()
  })

  it('sem o bloco daily, devolve lista de dias vazia', () => {
    const { daily: _daily, ...semDaily } = resposta
    expect(converterResposta(semDaily).dias).toEqual([])
  })
})
