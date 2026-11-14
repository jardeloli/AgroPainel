import { useNavigate } from 'react-router-dom'
import { FormularioTalhao } from '../componentes/FormularioTalhao'
import { entradaParaTalhao } from '../dominio'
import { useTalhoes } from '../hooks/useTalhoes'
import { useTitulo } from '../hooks/useTitulo'
import { gerarId } from '../servicos/utilitarios'

export function NovoTalhao() {
  useTitulo('Novo talhão')
  const navigate = useNavigate()
  const { municipioId, adicionarTalhao } = useTalhoes()

  return (
    <>
      <h1>Novo talhão</h1>
      <FormularioTalhao
        inicial={{ nome: '', cultura: '', areaHa: '', municipioId, dataPlantio: '' }}
        rotuloBotao="Cadastrar talhão"
        onSalvar={(entrada) => {
          const talhao = entradaParaTalhao(entrada, gerarId())
          adicionarTalhao(talhao)
          navigate(`/talhoes/${talhao.id}`)
        }}
      />
    </>
  )
}
