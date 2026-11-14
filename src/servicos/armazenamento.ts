import { MUNICIPIOS, MUNICIPIO_PADRAO } from '../dados/municipios'
import { dataValida, ehCultura, ehTipoOperacao } from '../dominio'
import type { Operacao, Talhao } from '../tipos'

const CHAVE = 'agropainel:v1'

export interface DadosPersistidos {
  talhoes: Talhao[]
  operacoes: Operacao[]
  municipioId: string
}

export const DADOS_VAZIOS: DadosPersistidos = {
  talhoes: [],
  operacoes: [],
  municipioId: MUNICIPIO_PADRAO.id,
}

type Registro = Record<string, unknown>

function ehRegistro(valor: unknown): valor is Registro {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function ehNumeroFinito(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor)
}

function ehTexto(valor: unknown): valor is string {
  return typeof valor === 'string' && valor !== ''
}

export function ehTalhao(valor: unknown): valor is Talhao {
  if (!ehRegistro(valor)) return false
  const { id, nome, cultura, areaHa, municipioId, dataPlantio } = valor
  return (
    ehTexto(id) &&
    ehTexto(nome) &&
    typeof cultura === 'string' &&
    ehCultura(cultura) &&
    ehNumeroFinito(areaHa) &&
    areaHa > 0 &&
    ehTexto(municipioId) &&
    (dataPlantio === null || (typeof dataPlantio === 'string' && dataValida(dataPlantio)))
  )
}

export function ehOperacao(valor: unknown): valor is Operacao {
  if (!ehRegistro(valor)) return false
  const { id, talhaoId, tipo, data, descricao, custoCentavos, produtividadeScHa } = valor
  return (
    ehTexto(id) &&
    ehTexto(talhaoId) &&
    typeof tipo === 'string' &&
    ehTipoOperacao(tipo) &&
    typeof data === 'string' &&
    dataValida(data) &&
    typeof descricao === 'string' &&
    ehNumeroFinito(custoCentavos) &&
    (produtividadeScHa === undefined || ehNumeroFinito(produtividadeScHa))
  )
}

/**
 * Leitura defensiva: valor apagado, corrompido ou com formato errado
 * vira um estado vazio (ou aproveita só o que for válido), nunca uma tela branca.
 */
export function lerDados(): DadosPersistidos {
  try {
    const texto = window.localStorage.getItem(CHAVE)
    if (texto === null) return DADOS_VAZIOS

    const bruto: unknown = JSON.parse(texto)
    if (!ehRegistro(bruto)) return DADOS_VAZIOS

    const talhoes = Array.isArray(bruto.talhoes) ? bruto.talhoes.filter(ehTalhao) : []
    const ids = new Set(talhoes.map((t) => t.id))
    const operacoes = Array.isArray(bruto.operacoes)
      ? bruto.operacoes.filter(ehOperacao).filter((o) => ids.has(o.talhaoId))
      : []
    const municipioId =
      typeof bruto.municipioId === 'string' && MUNICIPIOS.some((m) => m.id === bruto.municipioId)
        ? bruto.municipioId
        : MUNICIPIO_PADRAO.id

    return { talhoes, operacoes, municipioId }
  } catch {
    return DADOS_VAZIOS
  }
}

export function salvarDados(dados: DadosPersistidos): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(dados))
  } catch {
    // Armazenamento cheio ou bloqueado: o app continua funcionando só na memória.
  }
}
