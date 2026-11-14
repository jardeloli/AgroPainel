import { useEffect, useId, useRef } from 'react'

interface Props {
  aberto: boolean
  titulo: string
  texto: string
  rotuloConfirmar: string
  onConfirmar: () => void
  onCancelar: () => void
}

/** Confirmação usando o <dialog> nativo: prende o foco e fecha com Esc. */
export function DialogoConfirmacao({
  aberto,
  titulo,
  texto,
  rotuloConfirmar,
  onConfirmar,
  onCancelar,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const idTitulo = useId()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      className="dialogo"
      aria-labelledby={idTitulo}
      onCancel={(e) => {
        e.preventDefault()
        onCancelar()
      }}
    >
      <h2 id={idTitulo}>{titulo}</h2>
      <p>{texto}</p>
      <div className="acoes">
        <button type="button" className="botao botao--secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="button" className="botao botao--perigo" onClick={onConfirmar}>
          {rotuloConfirmar}
        </button>
      </div>
    </dialog>
  )
}
