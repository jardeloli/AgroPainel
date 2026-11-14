import type { MouseEvent } from 'react'
import { Outlet } from 'react-router-dom'
import { Cabecalho } from './Cabecalho'
import { Rodape } from './Rodape'

export function Layout() {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo-principal" onClick={irParaConteudo}>
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo-principal" className="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <Rodape />
    </>
  )
}

// Com HashRouter, o href "#..." mudaria a rota; por isso o foco é movido à mão.
function irParaConteudo(evento: MouseEvent<HTMLAnchorElement>) {
  evento.preventDefault()
  document.getElementById('conteudo-principal')?.focus()
}
