import { Link } from 'react-router-dom'
import { useTitulo } from '../hooks/useTitulo'

interface Props {
  titulo?: string
  texto?: string
  destino?: string
  rotuloLink?: string
}

export function NaoEncontrado({
  titulo = 'Página não encontrada',
  texto = 'O endereço que você abriu não existe no AgroPainel.',
  destino = '/',
  rotuloLink = 'Voltar para o início',
}: Props) {
  useTitulo(titulo)
  return (
    <section className="nao-encontrado">
      <h1>{titulo}</h1>
      <p>{texto}</p>
      <Link to={destino} className="botao">
        {rotuloLink}
      </Link>
    </section>
  )
}
