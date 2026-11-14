import { describe, expect, it } from 'vitest'
import type { Operacao, Talhao } from '../tipos'
import { DADOS_VAZIOS } from '../servicos/armazenamento'
import { reducer } from './reducer'

const t1: Talhao = {
  id: 't1',
  nome: 'Talhão 1',
  cultura: 'soja',
  areaHa: 10,
  municipioId: 'balsas',
  dataPlantio: null,
}
const op: Operacao = {
  id: 'o1',
  talhaoId: 't1',
  tipo: 'preparo',
  data: '2026-10-01',
  descricao: 'Gradagem',
  custoCentavos: 1000,
}

describe('reducer', () => {
  it('apagar um talhão apaga as operações dele', () => {
    let estado = reducer(DADOS_VAZIOS, { tipo: 'adicionar-talhao', talhao: t1 })
    estado = reducer(estado, { tipo: 'adicionar-operacao', operacao: op })
    expect(estado.operacoes).toHaveLength(1)
    estado = reducer(estado, { tipo: 'remover-talhao', id: 't1' })
    expect(estado.talhoes).toHaveLength(0)
    expect(estado.operacoes).toHaveLength(0)
  })

  it('atualiza um talhão sem mexer nos outros', () => {
    const t2 = { ...t1, id: 't2', nome: 'Talhão 2' }
    let estado = reducer(DADOS_VAZIOS, { tipo: 'adicionar-talhao', talhao: t1 })
    estado = reducer(estado, { tipo: 'adicionar-talhao', talhao: t2 })
    estado = reducer(estado, { tipo: 'atualizar-talhao', talhao: { ...t1, areaHa: 99 } })
    expect(estado.talhoes[0].areaHa).toBe(99)
    expect(estado.talhoes[1]).toEqual(t2)
  })
})
