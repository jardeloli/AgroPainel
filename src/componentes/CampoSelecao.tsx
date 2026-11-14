import type { ChangeEvent } from 'react'

export interface OpcaoSelecao {
  valor: string
  rotulo: string
}

interface Props {
  id: string
  rotulo: string
  valor: string
  opcoes: OpcaoSelecao[]
  onAlterar: (valor: string) => void
  erro?: string
  dica?: string
  /** Texto da primeira opção vazia, por exemplo "Escolha a cultura". */
  opcaoVazia?: string
  registrar?: (elemento: HTMLSelectElement | null) => void
}

export function CampoSelecao({
  id,
  rotulo,
  valor,
  opcoes,
  onAlterar,
  erro,
  dica,
  opcaoVazia,
  registrar,
}: Props) {
  const idErro = `${id}-erro`
  const idDica = `${id}-dica`
  const descritoPor = [erro ? idErro : '', dica ? idDica : ''].filter(Boolean).join(' ')

  return (
    <div className={erro ? 'campo campo--erro' : 'campo'}>
      <label htmlFor={id}>{rotulo}</label>
      <select
        id={id}
        ref={registrar}
        value={valor}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritoPor || undefined}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onAlterar(e.target.value)}
      >
        {opcaoVazia !== undefined && <option value="">{opcaoVazia}</option>}
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      {dica && (
        <p id={idDica} className="campo__dica">
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className="campo__erro">
          <span className="sr-only">Erro: </span>
          {erro}
        </p>
      )}
    </div>
  )
}
