import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DialogoConfirmacao } from '../componentes/DialogoConfirmacao'
import { FormularioTalhao } from '../componentes/FormularioTalhao'
import { entradaParaTalhao, talhaoParaEntrada } from '../dominio'
import { useTalhoes } from '../hooks/useTalhoes'
import { useTitulo } from '../hooks/useTitulo'
import { NaoEncontrado } from './NaoEncontrado'

export function EditarTalhao() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { talhoes, operacoes, atualizarTalhao, removerTalhao } = useTalhoes()
  const [confirmando, setConfirmando] = useState(false)

  const talhao = talhoes.find((t) => t.id === id)
  useTitulo(talhao ? `Editar ${talhao.nome}` : 'Talhão não encontrado')

  if (!talhao) {
    return (
      <NaoEncontrado
        titulo="Talhão não encontrado"
        texto="Ele pode ter sido excluído."
        destino="/talhoes"
        rotuloLink="Ver todos os talhões"
      />
    )
  }

  const totalOperacoes = operacoes.filter((o) => o.talhaoId === talhao.id).length

  return (
    <>
      <p className="migalhas">
        <Link to={`/talhoes/${talhao.id}`}>← Voltar para {talhao.nome}</Link>
      </p>
      <h1>Editar talhão</h1>
      <FormularioTalhao
        inicial={talhaoParaEntrada(talhao)}
        talhaoId={talhao.id}
        rotuloBotao="Salvar alterações"
        onSalvar={(entrada) => {
          atualizarTalhao(entradaParaTalhao(entrada, talhao.id))
          navigate(`/talhoes/${talhao.id}`)
        }}
      />

      <section className="zona-perigo" aria-labelledby="titulo-excluir">
        <h2 id="titulo-excluir">Excluir talhão</h2>
        <p>
          Isso apaga o talhão e as {totalOperacoes}{' '}
          {totalOperacoes === 1 ? 'operação registrada' : 'operações registradas'} nele.
        </p>
        <button type="button" className="botao botao--perigo" onClick={() => setConfirmando(true)}>
          Excluir talhão
        </button>
      </section>

      <DialogoConfirmacao
        aberto={confirmando}
        titulo={`Excluir ${talhao.nome}?`}
        texto="Essa ação não pode ser desfeita."
        rotuloConfirmar="Excluir talhão"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={() => {
          removerTalhao(talhao.id)
          navigate('/talhoes')
        }}
      />
    </>
  )
}
