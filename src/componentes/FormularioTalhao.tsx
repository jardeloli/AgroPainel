import { useMemo, useState, type FormEvent } from 'react'
import { CULTURAS, NOMES_CULTURA, validarTalhao } from '../dominio'
import { useFocoNoErro } from '../hooks/useFocoNoErro'
import { useTalhoes } from '../hooks/useTalhoes'
import { hojeIso } from '../servicos/utilitarios'
import type { CampoTalhao, EntradaTalhao } from '../tipos/formularios'
import { CampoSelecao } from './CampoSelecao'
import { CampoTexto } from './CampoTexto'
import { SeletorMunicipio } from './SeletorMunicipio'

// Ordem visual dos campos: o foco vai para o primeiro inválido nesta ordem.
const ORDEM: readonly CampoTalhao[] = ['nome', 'cultura', 'areaHa', 'municipioId', 'dataPlantio']

interface Props {
  inicial: EntradaTalhao
  /** Presente ao editar: o próprio talhão não conta como nome repetido. */
  talhaoId?: string
  rotuloBotao: string
  onSalvar: (entrada: EntradaTalhao) => void
}

export function FormularioTalhao({ inicial, talhaoId, rotuloBotao, onSalvar }: Props) {
  const { talhoes, operacoes } = useTalhoes()
  const hoje = hojeIso()
  const [valores, setValores] = useState<EntradaTalhao>(inicial)
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const { registrar, focarPrimeiroComErro } = useFocoNoErro(ORDEM)

  const errosAtuais = useMemo(
    () => validarTalhao(valores, talhoes, hoje, { idAtual: talhaoId, operacoes }),
    [valores, talhoes, hoje, talhaoId, operacoes],
  )
  // Os erros aparecem depois da primeira tentativa e se atualizam enquanto a pessoa corrige.
  const erros = tentouEnviar ? errosAtuais : {}

  function alterar(campo: CampoTalhao, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setTentouEnviar(true)
    if (Object.keys(errosAtuais).length > 0) {
      focarPrimeiroComErro(errosAtuais) // RC08: envio bloqueado, foco no primeiro campo inválido
      return
    }
    onSalvar(valores)
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <CampoTexto
        id="talhao-nome"
        rotulo="Nome do talhão"
        valor={valores.nome}
        onAlterar={(v) => alterar('nome', v)}
        erro={erros.nome}
        dica="Pelo menos 3 letras. Cada talhão precisa de um nome diferente."
        registrar={registrar('nome')}
      />
      <CampoSelecao
        id="talhao-cultura"
        rotulo="Cultura"
        valor={valores.cultura}
        onAlterar={(v) => alterar('cultura', v)}
        erro={erros.cultura}
        opcaoVazia="Escolha a cultura"
        opcoes={CULTURAS.map((c) => ({ valor: c, rotulo: NOMES_CULTURA[c] }))}
        registrar={registrar('cultura')}
      />
      <CampoTexto
        id="talhao-area"
        rotulo="Área (hectares)"
        modoEntrada="decimal"
        valor={valores.areaHa}
        onAlterar={(v) => alterar('areaHa', v)}
        erro={erros.areaHa}
        dica="De 0,01 a 10.000 ha. Exemplo: 250 ou 12,5."
        registrar={registrar('areaHa')}
      />
      <SeletorMunicipio
        id="talhao-municipio"
        valor={valores.municipioId}
        onAlterar={(v) => alterar('municipioId', v)}
        erro={erros.municipioId}
        opcaoVazia="Escolha o município"
        registrar={registrar('municipioId')}
      />
      <CampoTexto
        id="talhao-plantio"
        rotulo="Data de plantio (opcional)"
        tipo="date"
        max={hoje}
        valor={valores.dataPlantio}
        onAlterar={(v) => alterar('dataPlantio', v)}
        erro={erros.dataPlantio}
        dica="Deixe em branco se ainda não plantou."
        registrar={registrar('dataPlantio')}
      />
      <div className="acoes">
        <button type="submit" className="botao">
          {rotuloBotao}
        </button>
      </div>
    </form>
  )
}
