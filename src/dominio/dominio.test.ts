import { describe, expect, it } from 'vitest'
import type { EntradaOperacao, EntradaTalhao } from '../tipos/formularios'
import type { Operacao, Talhao } from '../tipos'
import {
  areaTotal,
  avaliarPulverizacao,
  calcularProducao,
  calcularSituacao,
  custoPorHectare,
  descreverTempo,
  diasDesdePlantio,
  descreverPrazoColheita,
  diasEntre,
  filtrarResumos,
  formatarData,
  gerarRelatorio,
  lerNumero,
  preverColheita,
  proximasColheitas,
  reaisParaCentavos,
  relatorioParaCsv,
  resumirTalhao,
  somarDias,
  validarOperacao,
  validarTalhao,
} from './index'

/** Hoje é 09/11/2026 em todos os cenários do enunciado. */
const HOJE = '2026-11-09'

function talhao(parcial: Partial<Talhao> = {}): Talhao {
  return {
    id: 't1',
    nome: 'Talhão 1',
    cultura: 'soja',
    areaHa: 250,
    municipioId: 'balsas',
    dataPlantio: null,
    ...parcial,
  }
}

function operacao(parcial: Partial<Operacao> = {}): Operacao {
  return {
    id: 'o1',
    talhaoId: 't1',
    tipo: 'adubacao',
    data: '2026-10-10',
    descricao: 'Adubação de base',
    custoCentavos: 0,
    ...parcial,
  }
}

const entradaTalhao = (p: Partial<EntradaTalhao> = {}): EntradaTalhao => ({
  nome: 'Talhão 9',
  cultura: 'soja',
  areaHa: '100',
  municipioId: 'balsas',
  dataPlantio: '',
  ...p,
})

const entradaOperacao = (p: Partial<EntradaOperacao> = {}): EntradaOperacao => ({
  tipo: 'adubacao',
  data: '2026-10-10',
  descricao: 'Adubação',
  custoReais: '100',
  produtividadeScHa: '',
  ...p,
})

describe('datas', () => {
  it('conta dias sem erro de fuso (armadilha do enunciado)', () => {
    expect(diasEntre('2026-10-01', HOJE)).toBe(39)
  })

  it('soma dias atravessando meses e anos', () => {
    expect(somarDias('2026-10-01', 120)).toBe('2027-01-29')
  })

  it('formata no padrão brasileiro', () => {
    expect(formatarData('2026-11-09')).toBe('09/11/2026')
  })
})

describe('A1/A2: ciclo, previsão e situação do talhão', () => {
  it('A01: soja plantada em 01/10/2026', () => {
    const t = talhao({ dataPlantio: '2026-10-01' })
    expect(diasDesdePlantio(t.dataPlantio as string, HOJE)).toBe(39)
    expect(preverColheita('soja', '2026-10-01')).toBe('2027-01-29')
    expect(calcularSituacao(t, [], HOJE)).toBe('em-desenvolvimento')
  })

  it('A02: milho plantado em 01/07/2026', () => {
    const t = talhao({ cultura: 'milho', dataPlantio: '2026-07-01' })
    expect(diasDesdePlantio('2026-07-01', HOJE)).toBe(131)
    expect(preverColheita('milho', '2026-07-01')).toBe('2026-11-18')
    expect(diasEntre(HOJE, '2026-11-18')).toBe(9)
    expect(calcularSituacao(t, [], HOJE)).toBe('colheita-proxima')
  })

  it('A03: feijão plantado em 01/08/2026, sem colheita', () => {
    const t = talhao({ cultura: 'feijao', dataPlantio: '2026-08-01' })
    expect(diasDesdePlantio('2026-08-01', HOJE)).toBe(100)
    expect(preverColheita('feijao', '2026-08-01')).toBe('2026-10-30')
    expect(calcularSituacao(t, [], HOJE)).toBe('ponto-de-colheita')
  })

  it('A04: o mesmo feijão, com colheita registrada, fica Colhido', () => {
    const t = talhao({ cultura: 'feijao', dataPlantio: '2026-08-01' })
    const colheita = operacao({ tipo: 'colheita', data: '2026-10-31', produtividadeScHa: 40 })
    expect(calcularSituacao(t, [colheita], HOJE)).toBe('colhido')
  })

  it('A05: sem data de plantio aguarda plantio e não tem previsão', () => {
    const resumo = resumirTalhao(talhao(), [], HOJE)
    expect(resumo.situacao).toBe('aguardando-plantio')
    expect(resumo.previsaoColheita).toBeNull()
  })

  it('respeita as fronteiras ciclo - 15 e ciclo', () => {
    // feijão: ciclo 90. 74 dias = em desenvolvimento, 75 = próxima, 89 = próxima, 90 = ponto
    const situacaoComDias = (dias: number) =>
      calcularSituacao(talhao({ cultura: 'feijao', dataPlantio: somarDias(HOJE, -dias) }), [], HOJE)
    expect(situacaoComDias(74)).toBe('em-desenvolvimento')
    expect(situacaoComDias(75)).toBe('colheita-proxima')
    expect(situacaoComDias(89)).toBe('colheita-proxima')
    expect(situacaoComDias(90)).toBe('ponto-de-colheita')
  })
})

describe('A3: indicador de pulverização', () => {
  const base = { vento: 6, temperatura: 27, umidade: 70, precipitacao: 0, probabilidadeChuva: 20 }

  it('A06: condições boas dão Favorável, sem motivos', () => {
    expect(avaliarPulverizacao(base)).toEqual({ nivel: 'favoravel', motivos: [] })
  })

  it('A07: vento de 12 km/h dá Atenção com o motivo de deriva', () => {
    expect(avaliarPulverizacao({ ...base, vento: 12 })).toEqual({
      nivel: 'atencao',
      motivos: ['Vento acima de 10 km/h, risco de deriva'],
    })
  })

  it('A08: vento 10 e umidade 55 estão dentro dos limites; só a temperatura falha', () => {
    const r = avaliarPulverizacao({ ...base, vento: 10, temperatura: 30, umidade: 55 })
    expect(r.nivel).toBe('atencao')
    expect(r.motivos).toEqual(['Temperatura de 30 °C ou mais'])
  })

  it('A09: quatro falhas dão Desfavorável', () => {
    const r = avaliarPulverizacao({
      vento: 2,
      temperatura: 33,
      umidade: 40,
      precipitacao: 0,
      probabilidadeChuva: 60,
    })
    expect(r.nivel).toBe('desfavoravel')
    expect(r.motivos).toHaveLength(4)
    expect(r.motivos[0]).toBe('Vento abaixo de 3 km/h, risco de inversão térmica')
    expect(r.motivos[3]).toBe('Chuva provável hoje (60%)')
  })

  it('vento de 3 km/h é aceito e chuva agora é um motivo', () => {
    expect(avaliarPulverizacao({ ...base, vento: 3 }).nivel).toBe('favoravel')
    expect(avaliarPulverizacao({ ...base, precipitacao: 0.2 }).motivos).toEqual(['Chovendo agora'])
  })
})

describe('A4: descrição do tempo', () => {
  it('traduz os códigos da OMM', () => {
    expect(descreverTempo(0)).toBe('Céu limpo')
    expect(descreverTempo(2)).toBe('Parcialmente nublado')
    expect(descreverTempo(48)).toBe('Neblina')
    expect(descreverTempo(53)).toBe('Garoa')
    expect(descreverTempo(65)).toBe('Chuva')
    expect(descreverTempo(81)).toBe('Pancadas de chuva')
    expect(descreverTempo(96)).toBe('Trovoada')
    expect(descreverTempo(70)).toBe('Condição desconhecida')
  })
})

describe('A5: validação do talhão', () => {
  const existentes = [talhao({ nome: 'Talhão 3', id: 't3' })]

  it('A10: nome repetido é recusado sem diferenciar maiúsculas', () => {
    const erros = validarTalhao(entradaTalhao({ nome: 'talhão 3' }), existentes, HOJE)
    expect(erros.nome).toBe('Já existe um talhão com esse nome.')
  })

  it('ao editar, o próprio nome não conta como duplicado', () => {
    const erros = validarTalhao(entradaTalhao({ nome: 'Talhão 3' }), existentes, HOJE, {
      idAtual: 't3',
    })
    expect(erros.nome).toBeUndefined()
  })

  it('exige nome com pelo menos 3 caracteres', () => {
    expect(validarTalhao(entradaTalhao({ nome: 'ab' }), [], HOJE).nome).toBeDefined()
    expect(validarTalhao(entradaTalhao({ nome: '  ' }), [], HOJE).nome).toBeDefined()
  })

  it('área precisa ficar entre 0 (exclusive) e 10.000 ha', () => {
    expect(validarTalhao(entradaTalhao({ areaHa: '0' }), [], HOJE).areaHa).toBeDefined()
    expect(validarTalhao(entradaTalhao({ areaHa: 'abc' }), [], HOJE).areaHa).toBeDefined()
    expect(validarTalhao(entradaTalhao({ areaHa: '10000,5' }), [], HOJE).areaHa).toBeDefined()
    expect(validarTalhao(entradaTalhao({ areaHa: '10000' }), [], HOJE).areaHa).toBeUndefined()
  })

  it('data de plantio pode ficar vazia, mas não pode ser futura', () => {
    expect(validarTalhao(entradaTalhao({ dataPlantio: '' }), [], HOJE).dataPlantio).toBeUndefined()
    expect(validarTalhao(entradaTalhao({ dataPlantio: HOJE }), [], HOJE).dataPlantio).toBeUndefined()
    expect(
      validarTalhao(entradaTalhao({ dataPlantio: '2026-11-10' }), [], HOJE).dataPlantio,
    ).toBeDefined()
  })

  it('não deixa a data de plantio ficar depois de uma adubação já registrada', () => {
    const ops = [operacao({ data: '2026-10-10' })]
    const erros = validarTalhao(entradaTalhao({ dataPlantio: '2026-10-20' }), [], HOJE, {
      idAtual: 't1',
      operacoes: ops,
    })
    expect(erros.dataPlantio).toBeDefined()
  })
})

describe('A6: validação das operações', () => {
  const plantado = talhao({ dataPlantio: '2026-10-01' })

  it('A11: pulverização antes do plantio é recusada no campo de data', () => {
    const erros = validarOperacao(
      entradaOperacao({ tipo: 'pulverizacao', data: '2026-09-30' }),
      plantado,
      [],
      HOJE,
    )
    expect(erros.data).toContain('anterior ao plantio')
  })

  it('adubação, pulverização e colheita exigem talhão plantado', () => {
    const erros = validarOperacao(entradaOperacao(), talhao(), [], HOJE)
    expect(erros.tipo).toBeDefined()
    expect(
      validarOperacao(entradaOperacao({ tipo: 'preparo' }), talhao(), [], HOJE).tipo,
    ).toBeUndefined()
  })

  it('recusa data futura', () => {
    expect(validarOperacao(entradaOperacao({ data: '2026-11-10' }), plantado, [], HOJE).data).toBe(
      'A data não pode ser futura.',
    )
  })

  it('aceita só uma colheita por talhão', () => {
    const colheita = operacao({ tipo: 'colheita', produtividadeScHa: 60 })
    const erros = validarOperacao(
      entradaOperacao({ tipo: 'colheita', produtividadeScHa: '60' }),
      plantado,
      [colheita],
      HOJE,
    )
    expect(erros.tipo).toBe('Este talhão já tem uma colheita registrada.')
  })

  it('colheita exige produtividade maior que 0', () => {
    const base = entradaOperacao({ tipo: 'colheita', data: '2026-11-01' })
    expect(validarOperacao({ ...base, produtividadeScHa: '' }, plantado, [], HOJE).produtividadeScHa).toBeDefined()
    expect(validarOperacao({ ...base, produtividadeScHa: '0' }, plantado, [], HOJE).produtividadeScHa).toBeDefined()
    expect(validarOperacao({ ...base, produtividadeScHa: '62' }, plantado, [], HOJE)).toEqual({})
  })
})

describe('dinheiro e números', () => {
  it('guarda em centavos sem erro de ponto flutuante', () => {
    expect(reaisParaCentavos(1250.5)).toBe(125050)
    expect(reaisParaCentavos(0.1 + 0.2)).toBe(30)
  })

  it('lê números no formato brasileiro', () => {
    expect(lerNumero('1.250,50')).toBe(1250.5)
    expect(lerNumero('12,5')).toBe(12.5)
    expect(lerNumero('250')).toBe(250)
    expect(lerNumero('abc')).toBeNull()
    expect(lerNumero('')).toBeNull()
  })
})

describe('A6.4 / A7: produção e relatório', () => {
  it('A12: soja de 250 ha com R$ 125.000 e R$ 37.500 custa R$ 650,00 por hectare', () => {
    const centavos = reaisParaCentavos(125000) + reaisParaCentavos(37500)
    expect(custoPorHectare(centavos, 250)).toBe(65000)
  })

  it('A13: 62 sc/ha em 250 ha produzem 15.500 sacas', () => {
    expect(calcularProducao(62, 250)).toBe(15500)
    expect(calcularProducao(58.7, 12.5)).toBe(734) // arredonda para a saca inteira
  })

  it('monta o relatório com área por cultura, custos e produção', () => {
    const t1 = talhao({ id: 't1', nome: 'Soja Norte', areaHa: 250 })
    const t2 = talhao({ id: 't2', nome: 'Milho Sul', cultura: 'milho', areaHa: 100 })
    const t3 = talhao({ id: 't3', nome: 'Soja Leste', areaHa: 50 })
    const ops = [
      operacao({ id: 'a', talhaoId: 't1', custoCentavos: 12500000 }),
      operacao({ id: 'b', talhaoId: 't1', custoCentavos: 3750000 }),
      operacao({
        id: 'c',
        talhaoId: 't1',
        tipo: 'colheita',
        custoCentavos: 0,
        produtividadeScHa: 62,
      }),
      operacao({ id: 'd', talhaoId: 't2', custoCentavos: 500000 }),
    ]
    const r = gerarRelatorio([t1, t2, t3], ops)

    expect(r.areaPorCultura).toEqual([
      { cultura: 'soja', areaHa: 300 },
      { cultura: 'milho', areaHa: 100 },
    ])
    expect(r.linhas[0]).toMatchObject({ custoPorHaCentavos: 65000, producaoSacas: 15500 })
    expect(r.linhas[1].producaoSacas).toBeNull()
    expect(r.linhas[2].custoTotalCentavos).toBe(0)
    expect(r.custoTotalCentavos).toBe(16750000)
    expect(r.producaoTotalSacas).toBe(15500)
  })

  it('exporta o relatório em CSV', () => {
    const csv = relatorioParaCsv(gerarRelatorio([talhao({ nome: 'A "1"' })], []))
    expect(csv.split('\r\n')).toHaveLength(3)
    expect(csv).toContain('"A ""1"""')
  })
})

describe('painel e filtros', () => {
  const t = [
    talhao({ id: 'a', nome: 'Várzea', dataPlantio: '2026-10-01' }),
    talhao({ id: 'b', nome: 'Chapada', cultura: 'milho', dataPlantio: '2026-07-01' }),
    talhao({ id: 'c', nome: 'Baixão', cultura: 'feijao' }),
    talhao({ id: 'd', nome: 'Serra', cultura: 'feijao', dataPlantio: '2026-08-01' }),
  ]
  const resumos = t.map((x) => resumirTalhao(x, [], HOJE))

  it('soma a área total', () => {
    expect(areaTotal(t)).toBe(1000)
  })

  it('lista as próximas colheitas pela previsão, ignorando talhões sem plantio', () => {
    expect(proximasColheitas(resumos).map((r) => r.talhao.id)).toEqual(['d', 'b', 'a'])
  })

  it('filtra por cultura, situação e nome sem diferenciar acentos', () => {
    const todos = { cultura: 'todas', situacao: 'todas', busca: '' } as const
    expect(filtrarResumos(resumos, { ...todos, cultura: 'feijao' })).toHaveLength(2)
    expect(filtrarResumos(resumos, { ...todos, situacao: 'colheita-proxima' })).toHaveLength(1)
    expect(filtrarResumos(resumos, { ...todos, busca: 'varzea' })[0].talhao.id).toBe('a')
  })
})

describe('prazo da colheita', () => {
  it('descreve quanto falta ou quanto passou', () => {
    expect(descreverPrazoColheita('2026-11-18', HOJE)).toBe('faltam 9 dias')
    expect(descreverPrazoColheita('2026-11-10', HOJE)).toBe('faltam 1 dia')
    expect(descreverPrazoColheita(HOJE, HOJE)).toBe('é hoje')
    expect(descreverPrazoColheita('2026-10-30', HOJE)).toBe('passou há 10 dias')
  })
})
