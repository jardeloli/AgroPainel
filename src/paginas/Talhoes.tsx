import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CartaoTalhao } from '../componentes/CartaoTalhao'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { FiltrosTalhoes } from '../componentes/FiltrosTalhoes'
import { filtrarResumos, resumirTalhao, type FiltrosTalhoes as Filtros } from '../dominio'
import { useTalhoes } from '../hooks/useTalhoes'
import { useTitulo } from '../hooks/useTitulo'
import { hojeIso } from '../servicos/utilitarios'

const FILTROS_INICIAIS: Filtros = { cultura: 'todas', situacao: 'todas', busca: '' }

export function Talhoes() {
  useTitulo('Talhões')
  const { talhoes, operacoes } = useTalhoes()
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS)

  const hoje = hojeIso()
  const todos = talhoes.map((t) => resumirTalhao(t, operacoes, hoje))
  const visiveis = filtrarResumos(todos, filtros)

  return (
    <>
      <div className="pagina-topo">
        <h1>Talhões</h1>
        <Link to="/talhoes/novo" className="botao">
          Novo talhão
        </Link>
      </div>

      {talhoes.length === 0 ? (
        <EstadoVazio titulo="Você ainda não cadastrou nenhum talhão">
          <p>Cadastre um talhão para acompanhar a situação da lavoura e registrar as operações.</p>
          <Link to="/talhoes/novo" className="botao">
            Cadastrar o primeiro talhão
          </Link>
        </EstadoVazio>
      ) : (
        <>
          <FiltrosTalhoes filtros={filtros} onAlterar={setFiltros} />
          <p className="contagem" role="status">
            {visiveis.length === 1 ? '1 talhão' : `${visiveis.length} talhões`}
            {visiveis.length !== todos.length && ` de ${todos.length}`}
          </p>
          {visiveis.length === 0 ? (
            <EstadoVazio titulo="Nenhum talhão com esses filtros">
              <button type="button" className="botao botao--secundario" onClick={() => setFiltros(FILTROS_INICIAIS)}>
                Limpar filtros
              </button>
            </EstadoVazio>
          ) : (
            <ul className="grade">
              {visiveis.map((r) => (
                <li key={r.talhao.id}>
                  <CartaoTalhao resumo={r} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
