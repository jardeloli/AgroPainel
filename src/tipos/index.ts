export type Cultura = 'soja' | 'milho' | 'algodao' | 'arroz' | 'feijao'

export interface Talhao {
  id: string
  nome: string
  cultura: Cultura
  areaHa: number
  municipioId: string
  dataPlantio: string | null // 'AAAA-MM-DD', ou null se ainda não plantou
}

export type TipoOperacao =
  | 'preparo'
  | 'plantio'
  | 'adubacao'
  | 'pulverizacao'
  | 'colheita'

export interface Operacao {
  id: string
  talhaoId: string
  tipo: TipoOperacao
  data: string // 'AAAA-MM-DD'
  descricao: string
  custoCentavos: number
  produtividadeScHa?: number // só na colheita, em sacas por hectare
}

export type SituacaoTalhao =
  | 'colhido'
  | 'aguardando-plantio'
  | 'em-desenvolvimento'
  | 'colheita-proxima'
  | 'ponto-de-colheita'

export type NivelPulverizacao = 'favoravel' | 'atencao' | 'desfavoravel'

export interface Municipio {
  id: string
  nome: string
  latitude: number
  longitude: number
}

/* ---------- Clima (já convertido do formato da API) ---------- */

export interface ClimaAtual {
  temperatura: number // °C
  umidade: number // %
  precipitacao: number // mm
  vento: number // km/h
  codigo: number // weather_code (OMM)
}

export interface PrevisaoDia {
  data: string // 'AAAA-MM-DD'
  codigo: number
  maxima: number
  minima: number
  chuvaMm: number
  probabilidadeChuva: number // %
}

export interface Clima {
  atual: ClimaAtual
  dias: PrevisaoDia[]
}

export interface CondicoesPulverizacao {
  vento: number
  temperatura: number
  umidade: number
  precipitacao: number
  probabilidadeChuva: number
}

export interface AvaliacaoPulverizacao {
  nivel: NivelPulverizacao
  motivos: string[]
}

/* ---------- Derivados usados pelas telas ---------- */

export interface ResumoTalhao {
  talhao: Talhao
  situacao: SituacaoTalhao
  diasDesdePlantio: number | null
  previsaoColheita: string | null
}

export interface LinhaRelatorioTalhao {
  talhaoId: string
  nome: string
  cultura: Cultura
  areaHa: number
  custoTotalCentavos: number
  custoPorHaCentavos: number
  producaoSacas: number | null
}

export interface AreaPorCultura {
  cultura: Cultura
  areaHa: number
}

export interface Relatorio {
  areaPorCultura: AreaPorCultura[]
  linhas: LinhaRelatorioTalhao[]
  custoTotalCentavos: number
  producaoTotalSacas: number
}
