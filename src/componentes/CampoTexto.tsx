import type { ChangeEvent, HTMLInputTypeAttribute } from 'react'

interface Props {
  id: string
  rotulo: string
  valor: string
  onAlterar: (valor: string) => void
  erro?: string
  dica?: string
  tipo?: HTMLInputTypeAttribute
  modoEntrada?: 'text' | 'decimal' | 'numeric'
  max?: string
  placeholder?: string
  autoComplete?: string
  registrar?: (elemento: HTMLInputElement | null) => void
}

export function CampoTexto({
  id,
  rotulo,
  valor,
  onAlterar,
  erro,
  dica,
  tipo = 'text',
  modoEntrada,
  max,
  placeholder,
  autoComplete = 'off',
  registrar,
}: Props) {
  const idErro = `${id}-erro`
  const idDica = `${id}-dica`
  const descritoPor = [erro ? idErro : '', dica ? idDica : ''].filter(Boolean).join(' ')

  return (
    <div className={erro ? 'campo campo--erro' : 'campo'}>
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        ref={registrar}
        type={tipo}
        inputMode={modoEntrada}
        value={valor}
        max={max}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritoPor || undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onAlterar(e.target.value)}
      />
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
