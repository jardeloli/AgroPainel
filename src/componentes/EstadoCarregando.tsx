interface Props {
  mensagem?: string
}

export function EstadoCarregando({ mensagem = 'Carregando…' }: Props) {
  return (
    <div className="estado estado--carregando" role="status" aria-live="polite">
      <span className="giro" aria-hidden="true" />
      <p>{mensagem}</p>
    </div>
  )
}
