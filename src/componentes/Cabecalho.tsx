import { NavLink } from 'react-router-dom'

const LINKS = [
  { para: '/', rotulo: 'Painel', exato: true },
  { para: '/talhoes', rotulo: 'Talhões', exato: false },
  { para: '/relatorio', rotulo: 'Relatório', exato: false },
]

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interno">
        <NavLink to="/" className="marca" aria-label="AgroPainel, ir para o painel">
          <span className="marca__nome">AgroPainel</span>
          <span className="marca__regiao">Sul do Maranhão</span>
        </NavLink>
        <nav aria-label="Principal">
          <ul className="menu">
            {LINKS.map((l) => (
              <li key={l.para}>
                <NavLink to={l.para} end={l.exato} className="menu__link">
                  {l.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
