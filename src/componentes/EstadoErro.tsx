interface Props {
  titulo?: string
  mensagem: string
  onTentarNovamente: () => void
}

export function EstadoErro({ titulo = 'Algo deu errado', mensagem, onTentarNovamente }: Props) {
  return (
    <div className="estado estado--erro" role="alert">
      <p className="estado__titulo">{titulo}</p>
      <p>{mensagem}</p>
      <button type="button" className="botao" onClick={onTentarNovamente}>
        Tentar de novo
      </button>
    </div>
  )
}
