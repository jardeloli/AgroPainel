import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarMunicipio } from '../dados/municipios'
import { DialogoConfirmacao } from '../componentes/DialogoConfirmacao'
import { FormularioOperacao } from '../componentes/FormularioOperacao'
import { ListaOperacoes } from '../componentes/ListaOperacoes'
import { SeloSituacao } from '../componentes/SeloSituacao'
import {
  NOMES_CULTURA,
  NOMES_OPERACAO,
  custoPorHectare,
  custoTotalDoTalhao,
  descreverPrazoColheita,
  entradaParaOperacao,
  formatarData,
  formatarNumero,
  formatarReais,
  producaoDoTalhao,
  resumirTalhao,
} from '../dominio'
import { useTalhoes } from '../hooks/useTalhoes'
import { useTitulo } from '../hooks/useTitulo'
import { gerarId, hojeIso } from '../servicos/utilitarios'
import type { Operacao } from '../tipos'
import { NaoEncontrado } from './NaoEncontrado'

export function DetalheTalhao() {
  const { id } = useParams<{ id: string }>()
  const { talhoes, operacoes, adicionarOperacao, removerOperacao } = useTalhoes()
  const [paraRemover, setParaRemover] = useState<Operacao | null>(null)

  const talhao = talhoes.find((t) => t.id === id)
  useTitulo(talhao ? talhao.nome : 'Talhão não encontrado')

  if (!talhao) {
    return (
      <NaoEncontrado
        titulo="Talhão não encontrado"
        texto="Ele pode ter sido excluído ou o endereço está incorreto."
        destino="/talhoes"
        rotuloLink="Ver todos os talhões"
      />
    )
  }

  const hoje = hojeIso()
  const doTalhao = operacoes.filter((o) => o.talhaoId === talhao.id)
  const resumo = resumirTalhao(talhao, operacoes, hoje)
  const municipio = buscarMunicipio(talhao.municipioId)
  const custoTotal = custoTotalDoTalhao(talhao.id, operacoes)
  const producao = producaoDoTalhao(talhao, operacoes)
  const precisaPlantar = talhao.dataPlantio === null

  return (
    <>
      <p className="migalhas">
        <Link to="/talhoes">← Todos os talhões</Link>
      </p>

      <div className="pagina-topo">
        <div>
          <h1>{talhao.nome}</h1>
          <p className="subtitulo">
            {NOMES_CULTURA[talhao.cultura]}, {formatarNumero(talhao.areaHa, 2)} ha
            {municipio && `, ${municipio.nome}`}
          </p>
        </div>
        <div className="pagina-topo__acoes">
          <SeloSituacao situacao={resumo.situacao} />
          <Link to={`/talhoes/${talhao.id}/editar`} className="botao botao--secundario">
            Editar talhão
          </Link>
        </div>
      </div>

      <section className="cartao" aria-labelledby="titulo-situacao">
        <h2 id="titulo-situacao">Situação da lavoura</h2>
        <dl className="medidas">
          <div>
            <dt>Data de plantio</dt>
            <dd>{talhao.dataPlantio !== null ? formatarData(talhao.dataPlantio) : 'Ainda não plantado'}</dd>
          </div>
          <div>
            <dt>Dias desde o plantio</dt>
            <dd>{resumo.diasDesdePlantio !== null ? formatarNumero(resumo.diasDesdePlantio) : '–'}</dd>
          </div>
          <div>
            <dt>Colheita prevista</dt>
            <dd>
              {resumo.previsaoColheita !== null ? (
                <>
                  {formatarData(resumo.previsaoColheita)}
                  {resumo.situacao !== 'colhido' && (
                    <span className="medidas__nota">
                      {descreverPrazoColheita(resumo.previsaoColheita, hoje)}
                    </span>
                  )}
                </>
              ) : (
                'Sem previsão'
              )}
            </dd>
          </div>
          <div>
            <dt>Custo total</dt>
            <dd>
              {formatarReais(custoTotal)}
              <span className="medidas__nota">{formatarReais(custoPorHectare(custoTotal, talhao.areaHa))} por ha</span>
            </dd>
          </div>
          {producao !== null && (
            <div>
              <dt>Produção</dt>
              <dd>{formatarNumero(producao)} sacas</dd>
            </div>
          )}
        </dl>
      </section>

      <section aria-labelledby="titulo-diario" className="secao">
        <h2 id="titulo-diario">Diário de operações</h2>
        <ListaOperacoes talhao={talhao} operacoes={doTalhao} onRemover={setParaRemover} />
      </section>

      <section aria-labelledby="titulo-nova-operacao" className="secao cartao">
        <h2 id="titulo-nova-operacao">Nova operação</h2>
        {precisaPlantar && (
          <p className="aviso">
            Este talhão ainda não tem data de plantio. Adubação, pulverização e colheita só podem ser
            registradas depois que ele for plantado.{' '}
            <Link to={`/talhoes/${talhao.id}/editar`}>Informar data de plantio</Link>
          </p>
        )}
        <FormularioOperacao
          talhao={talhao}
          onRegistrar={(entrada) => adicionarOperacao(entradaParaOperacao(entrada, talhao.id, gerarId()))}
        />
      </section>

      <DialogoConfirmacao
        aberto={paraRemover !== null}
        titulo="Remover esta operação?"
        texto={
          paraRemover
            ? `${NOMES_OPERACAO[paraRemover.tipo]} de ${formatarData(paraRemover.data)}: ${paraRemover.descricao}`
            : ''
        }
        rotuloConfirmar="Remover operação"
        onCancelar={() => setParaRemover(null)}
        onConfirmar={() => {
          if (paraRemover) removerOperacao(paraRemover.id)
          setParaRemover(null)
        }}
      />
    </>
  )
}
