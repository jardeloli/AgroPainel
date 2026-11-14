import type { ReactNode } from 'react'

interface Props {
  titulo: string
  children?: ReactNode
}

export function EstadoVazio({ titulo, children }: Props) {
  return (
    <div className="estado estado--vazio">
      <p className="estado__titulo">{titulo}</p>
      {children}
    </div>
  )
}
