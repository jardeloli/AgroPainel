import { buscarMunicipio, MUNICIPIO_PADRAO } from '../dados/municipios'
import { areaTotal, proximasColheitas, resumirTalhao } from '../dominio'
import { EstadoCarregando } from '../componentes/EstadoCarregando'
import { EstadoErro } from '../componentes/EstadoErro'
import { PainelClima } from '../componentes/PainelClima'
import { ResumoPainel } from '../componentes/ResumoPainel'
import { SeletorMunicipio } from '../componentes/SeletorMunicipio'
import { useClima } from '../hooks/useClima'
import { useTalhoes } from '../hooks/useTalhoes'
import { useTitulo } from '../hooks/useTitulo'
import { hojeIso } from '../servicos/utilitarios'

export function Painel() {
  useTitulo('Painel')
  const { talhoes, operacoes, municipioId, definirMunicipio } = useTalhoes()
  const municipio = buscarMunicipio(municipioId) ?? MUNICIPIO_PADRAO
  const { estado, tentarNovamente } = useClima(municipio)

  const hoje = hojeIso()
  const resumos = talhoes.map((t) => resumirTalhao(t, operacoes, hoje))

  return (
    <>
      <div className="pagina-topo">
        <h1>Painel</h1>
        <div className="pagina-topo__seletor">
          <SeletorMunicipio id="painel-municipio" valor={municipio.id} onAlterar={definirMunicipio} />
        </div>
      </div>

      <div className="painel">
        <div className="painel__clima" aria-live="polite">
          {estado.status === 'carregando' && (
            <EstadoCarregando mensagem={`Carregando o clima de ${municipio.nome}…`} />
          )}
          {estado.status === 'erro' && (
            <EstadoErro
              titulo={`Sem o clima de ${municipio.nome}`}
              mensagem={estado.mensagem}
              onTentarNovamente={tentarNovamente}
            />
          )}
          {estado.status === 'sucesso' && (
            <PainelClima municipioNome={municipio.nome} clima={estado.clima} />
          )}
        </div>

        <div className="painel__resumo">
          <ResumoPainel
            areaTotalHa={areaTotal(talhoes)}
            totalTalhoes={talhoes.length}
            proximas={proximasColheitas(resumos)}
          />
        </div>
      </div>
    </>
  )
}
