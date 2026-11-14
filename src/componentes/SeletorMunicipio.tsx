import { MUNICIPIOS } from '../dados/municipios'
import { CampoSelecao } from './CampoSelecao'

interface Props {
  id: string
  valor: string
  onAlterar: (municipioId: string) => void
  rotulo?: string
  erro?: string
  opcaoVazia?: string
  registrar?: (elemento: HTMLSelectElement | null) => void
}

export function SeletorMunicipio({
  id,
  valor,
  onAlterar,
  rotulo = 'Município',
  erro,
  opcaoVazia,
  registrar,
}: Props) {
  return (
    <CampoSelecao
      id={id}
      rotulo={rotulo}
      valor={valor}
      onAlterar={onAlterar}
      erro={erro}
      opcaoVazia={opcaoVazia}
      registrar={registrar}
      opcoes={MUNICIPIOS.map((m) => ({ valor: m.id, rotulo: m.nome }))}
    />
  )
}
