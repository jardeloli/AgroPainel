import type { Cultura, Operacao, Talhao, TipoOperacao } from '../tipos'
import type {
  EntradaOperacao,
  EntradaTalhao,
  ErrosOperacao,
  ErrosTalhao,
} from '../tipos/formularios'
import { dataValida, diasEntre, formatarData } from './datas'
import { lerNumero, reaisParaCentavos } from './dinheiro'
import { CULTURAS, normalizarTexto } from './talhao'

export const AREA_MAXIMA_HA = 10000

export const TIPOS_OPERACAO: TipoOperacao[] = [
  'preparo',
  'plantio',
  'adubacao',
  'pulverizacao',
  'colheita',
]

export const NOMES_OPERACAO: Record<TipoOperacao, string> = {
  preparo: 'Preparo do solo',
  plantio: 'Plantio',
  adubacao: 'Adubação',
  pulverizacao: 'Pulverização',
  colheita: 'Colheita',
}

/** A6.1: estas operações só existem em talhão plantado. */
const EXIGEM_PLANTIO: TipoOperacao[] = ['adubacao', 'pulverizacao', 'colheita']

export function ehCultura(valor: string): valor is Cultura {
  return (CULTURAS as string[]).includes(valor)
}

export function ehTipoOperacao(valor: string): valor is TipoOperacao {
  return (TIPOS_OPERACAO as string[]).includes(valor)
}

function nomesIguais(a: string, b: string): boolean {
  return normalizarTexto(a) === normalizarTexto(b)
}

export function areaDeTexto(texto: string): number | null {
  return lerNumero(texto)
}

export interface ContextoValidacaoTalhao {
  /** Ao editar, o próprio talhão não conta como duplicado. */
  idAtual?: string
  /** Operações já registradas, para não deixar a data de plantio contradizê-las. */
  operacoes?: Operacao[]
}

/** A5: validação do talhão. */
export function validarTalhao(
  entrada: EntradaTalhao,
  existentes: Talhao[],
  hoje: string,
  contexto: ContextoValidacaoTalhao = {},
): ErrosTalhao {
  const erros: ErrosTalhao = {}

  const nome = entrada.nome.trim()
  if (nome === '') {
    erros.nome = 'Informe o nome do talhão.'
  } else if (nome.length < 3) {
    erros.nome = 'O nome precisa ter pelo menos 3 caracteres.'
  } else if (existentes.some((t) => t.id !== contexto.idAtual && nomesIguais(t.nome, nome))) {
    erros.nome = 'Já existe um talhão com esse nome.'
  }

  if (!ehCultura(entrada.cultura)) erros.cultura = 'Escolha a cultura.'
  if (entrada.municipioId === '') erros.municipioId = 'Escolha o município.'

  const area = areaDeTexto(entrada.areaHa)
  if (area === null) {
    erros.areaHa = 'Informe a área em hectares, por exemplo 250 ou 12,5.'
  } else if (area <= 0) {
    erros.areaHa = 'A área precisa ser maior que 0.'
  } else if (area > AREA_MAXIMA_HA) {
    erros.areaHa = 'A área máxima é de 10.000 ha.'
  }

  const data = entrada.dataPlantio
  const opsDoTalhao = (contexto.operacoes ?? []).filter((o) => o.talhaoId === contexto.idAtual)
  const opsQueExigemPlantio = opsDoTalhao.filter((o) => EXIGEM_PLANTIO.includes(o.tipo))

  if (data === '') {
    if (opsQueExigemPlantio.length > 0) {
      erros.dataPlantio =
        'Este talhão já tem adubação, pulverização ou colheita. Informe a data de plantio.'
    }
  } else if (!dataValida(data)) {
    erros.dataPlantio = 'Informe uma data válida.'
  } else if (diasEntre(hoje, data) > 0) {
    erros.dataPlantio = 'A data de plantio não pode ser futura.'
  } else {
    const anterior = opsQueExigemPlantio.find((o) => diasEntre(data, o.data) < 0)
    if (anterior) {
      erros.dataPlantio = `Há uma operação em ${formatarData(anterior.data)}, anterior a esta data.`
    }
  }

  return erros
}

export function entradaParaTalhao(entrada: EntradaTalhao, id: string): Talhao {
  if (!ehCultura(entrada.cultura)) throw new Error('Cultura inválida')
  const area = areaDeTexto(entrada.areaHa)
  if (area === null) throw new Error('Área inválida')
  return {
    id,
    nome: entrada.nome.trim(),
    cultura: entrada.cultura,
    areaHa: area,
    municipioId: entrada.municipioId,
    dataPlantio: entrada.dataPlantio === '' ? null : entrada.dataPlantio,
  }
}

/** A6: validação das operações. */
export function validarOperacao(
  entrada: EntradaOperacao,
  talhao: Talhao,
  operacoes: Operacao[],
  hoje: string,
): ErrosOperacao {
  const erros: ErrosOperacao = {}
  const tipo = entrada.tipo

  if (!ehTipoOperacao(tipo)) {
    erros.tipo = 'Escolha o tipo da operação.'
  }

  if (entrada.data === '') {
    erros.data = 'Informe a data da operação.'
  } else if (!dataValida(entrada.data)) {
    erros.data = 'Informe uma data válida.'
  } else if (diasEntre(hoje, entrada.data) > 0) {
    erros.data = 'A data não pode ser futura.' // A6.2
  }

  if (ehTipoOperacao(tipo) && EXIGEM_PLANTIO.includes(tipo)) {
    if (talhao.dataPlantio === null) {
      erros.tipo =
        'Este talhão ainda não foi plantado. Informe a data de plantio antes desta operação.'
    } else if (!erros.data && diasEntre(talhao.dataPlantio, entrada.data) < 0) {
      erros.data = `A data não pode ser anterior ao plantio (${formatarData(talhao.dataPlantio)}).` // A6.1
    }
  }

  if (entrada.descricao.trim() === '') erros.descricao = 'Descreva o que foi feito.'

  const custo = lerNumero(entrada.custoReais)
  if (custo === null) {
    erros.custoReais = 'Informe o custo em reais, por exemplo 1250,50. Use 0 se não houve custo.'
  } else if (custo < 0) {
    erros.custoReais = 'O custo não pode ser negativo.'
  }

  if (tipo === 'colheita') {
    if (operacoes.some((o) => o.talhaoId === talhao.id && o.tipo === 'colheita')) {
      erros.tipo = 'Este talhão já tem uma colheita registrada.' // A6.3
    }
    const prod = lerNumero(entrada.produtividadeScHa)
    if (prod === null || prod <= 0) {
      erros.produtividadeScHa = 'Informe a produtividade em sacas por hectare, maior que 0.' // A6.4
    }
  }

  return erros
}

export function entradaParaOperacao(
  entrada: EntradaOperacao,
  talhaoId: string,
  id: string,
): Operacao {
  if (!ehTipoOperacao(entrada.tipo)) throw new Error('Tipo inválido')
  const custo = lerNumero(entrada.custoReais)
  if (custo === null) throw new Error('Custo inválido')

  const operacao: Operacao = {
    id,
    talhaoId,
    tipo: entrada.tipo,
    data: entrada.data,
    descricao: entrada.descricao.trim(),
    custoCentavos: reaisParaCentavos(custo), // A6.5
  }
  if (entrada.tipo === 'colheita') {
    const prod = lerNumero(entrada.produtividadeScHa)
    if (prod !== null) operacao.produtividadeScHa = prod
  }
  return operacao
}

/** Converte um talhão salvo de volta para os textos do formulário (edição). */
export function talhaoParaEntrada(talhao: Talhao): EntradaTalhao {
  return {
    nome: talhao.nome,
    cultura: talhao.cultura,
    areaHa: String(talhao.areaHa).replace('.', ','),
    municipioId: talhao.municipioId,
    dataPlantio: talhao.dataPlantio ?? '',
  }
}
