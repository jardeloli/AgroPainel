import { useMemo, useState, type FormEvent } from 'react'
import { NOMES_OPERACAO, TIPOS_OPERACAO, validarOperacao } from '../dominio'
import { useFocoNoErro } from '../hooks/useFocoNoErro'
import { useTalhoes } from '../hooks/useTalhoes'
import { hojeIso } from '../servicos/utilitarios'
import type { Talhao } from '../tipos'
import type { CampoOperacao, EntradaOperacao } from '../tipos/formularios'
import { CampoSelecao } from './CampoSelecao'
import { CampoTexto } from './CampoTexto'

const ORDEM: readonly CampoOperacao[] = [
  'tipo',
  'data',
  'descricao',
  'custoReais',
  'produtividadeScHa',
]

interface Props {
  talhao: Talhao
  onRegistrar: (entrada: EntradaOperacao) => void
}

function entradaInicial(hoje: string): EntradaOperacao {
  return { tipo: '', data: hoje, descricao: '', custoReais: '', produtividadeScHa: '' }
}

export function FormularioOperacao({ talhao, onRegistrar }: Props) {
  const { operacoes } = useTalhoes()
  const hoje = hojeIso()
  const [valores, setValores] = useState<EntradaOperacao>(() => entradaInicial(hoje))
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [aviso, setAviso] = useState('')
  const { registrar, focarPrimeiroComErro } = useFocoNoErro(ORDEM)

  const errosAtuais = useMemo(
    () => validarOperacao(valores, talhao, operacoes, hoje),
    [valores, talhao, operacoes, hoje],
  )
  const erros = tentouEnviar ? errosAtuais : {}

  function alterar(campo: CampoOperacao, valor: string) {
    setAviso('')
    setValores((v) => ({ ...v, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setTentouEnviar(true)
    if (Object.keys(errosAtuais).length > 0) {
      setAviso('')
      focarPrimeiroComErro(errosAtuais)
      return
    }
    onRegistrar(valores)
    setValores(entradaInicial(hoje))
    setTentouEnviar(false)
    setAviso('Operação registrada.')
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <CampoSelecao
        id="operacao-tipo"
        rotulo="Tipo de operação"
        valor={valores.tipo}
        onAlterar={(v) => alterar('tipo', v)}
        erro={erros.tipo}
        opcaoVazia="Escolha o tipo"
        opcoes={TIPOS_OPERACAO.map((t) => ({ valor: t, rotulo: NOMES_OPERACAO[t] }))}
        registrar={registrar('tipo')}
      />
      <CampoTexto
        id="operacao-data"
        rotulo="Data"
        tipo="date"
        max={hoje}
        valor={valores.data}
        onAlterar={(v) => alterar('data', v)}
        erro={erros.data}
        registrar={registrar('data')}
      />
      <CampoTexto
        id="operacao-descricao"
        rotulo="Descrição"
        valor={valores.descricao}
        onAlterar={(v) => alterar('descricao', v)}
        erro={erros.descricao}
        dica="Exemplo: aplicação de herbicida em área total."
        registrar={registrar('descricao')}
      />
      <CampoTexto
        id="operacao-custo"
        rotulo="Custo (R$)"
        modoEntrada="decimal"
        valor={valores.custoReais}
        onAlterar={(v) => alterar('custoReais', v)}
        erro={erros.custoReais}
        dica="Exemplo: 1250,50. Use 0 se não houve custo."
        registrar={registrar('custoReais')}
      />
      {valores.tipo === 'colheita' && (
        <CampoTexto
          id="operacao-produtividade"
          rotulo="Produtividade (sacas por hectare)"
          modoEntrada="decimal"
          valor={valores.produtividadeScHa}
          onAlterar={(v) => alterar('produtividadeScHa', v)}
          erro={erros.produtividadeScHa}
          dica="A produção do talhão será a produtividade vezes a área."
          registrar={registrar('produtividadeScHa')}
        />
      )}
      <div className="acoes">
        <button type="submit" className="botao">
          Registrar operação
        </button>
        <p className="aviso-sucesso" role="status">
          {aviso}
        </p>
      </div>
    </form>
  )
}
