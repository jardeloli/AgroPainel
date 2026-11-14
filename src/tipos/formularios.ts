/** Valores crus dos formulários: tudo texto, como vem dos campos. */
export interface EntradaTalhao {
  nome: string
  cultura: string
  areaHa: string
  municipioId: string
  dataPlantio: string
}

export type CampoTalhao = keyof EntradaTalhao
export type ErrosTalhao = Partial<Record<CampoTalhao, string>>

export interface EntradaOperacao {
  tipo: string
  data: string
  descricao: string
  custoReais: string
  produtividadeScHa: string
}

export type CampoOperacao = keyof EntradaOperacao
export type ErrosOperacao = Partial<Record<CampoOperacao, string>>
