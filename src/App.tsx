import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './componentes/Layout'
import { TalhoesProvider } from './contexto/TalhoesProvider'
import { DetalheTalhao } from './paginas/DetalheTalhao'
import { EditarTalhao } from './paginas/EditarTalhao'
import { NaoEncontrado } from './paginas/NaoEncontrado'
import { NovoTalhao } from './paginas/NovoTalhao'
import { Painel } from './paginas/Painel'
import { Relatorio } from './paginas/Relatorio'
import { Talhoes } from './paginas/Talhoes'

export default function App() {
  return (
    <TalhoesProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Painel />} />
            <Route path="/talhoes" element={<Talhoes />} />
            <Route path="/talhoes/novo" element={<NovoTalhao />} />
            <Route path="/talhoes/:id" element={<DetalheTalhao />} />
            <Route path="/talhoes/:id/editar" element={<EditarTalhao />} />
            <Route path="/relatorio" element={<Relatorio />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </HashRouter>
    </TalhoesProvider>
  )
}
