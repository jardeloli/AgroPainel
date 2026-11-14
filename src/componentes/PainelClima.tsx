import { descreverTempo, diaDaSemana, formatarNumero, iconeDoTempo } from '../dominio'
import type { Clima } from '../tipos'
import { EstadoVazio } from './EstadoVazio'
import { IndicadorPulverizacao } from './IndicadorPulverizacao'

interface Props {
  municipioNome: string
  clima: Clima
}

export function PainelClima({ municipioNome, clima }: Props) {
  const { atual, dias } = clima

  return (
    <div className="clima">
      <IndicadorPulverizacao clima={clima} />

      <section className="cartao" aria-labelledby="titulo-agora">
        <h2 id="titulo-agora">Agora em {municipioNome}</h2>
        <p className="clima__tempo">
          <span className="clima__icone" aria-hidden="true">
            {iconeDoTempo(atual.codigo)}
          </span>
          <span className="clima__temperatura">{formatarNumero(atual.temperatura, 1)} °C</span>
          <span>{descreverTempo(atual.codigo)}</span>
        </p>
        <dl className="medidas">
          <div>
            <dt>Vento</dt>
            <dd>{formatarNumero(atual.vento, 1)} km/h</dd>
          </div>
          <div>
            <dt>Umidade</dt>
            <dd>{formatarNumero(atual.umidade)}%</dd>
          </div>
          <div>
            <dt>Chuva agora</dt>
            <dd>{formatarNumero(atual.precipitacao, 1)} mm</dd>
          </div>
        </dl>
      </section>

      <section className="cartao cartao--largo" aria-labelledby="titulo-previsao">
        <h2 id="titulo-previsao">Próximos 7 dias</h2>
        {dias.length === 0 ? (
          <EstadoVazio titulo="Sem previsão disponível">
            <p>O serviço não enviou a previsão dos próximos dias para este município.</p>
          </EstadoVazio>
        ) : (
          <ol className="previsao">
            {dias.map((d, i) => (
              <li key={d.data} className="previsao__dia">
                <span className="previsao__nome">
                  {i === 0 ? 'Hoje' : diaDaSemana(d.data)}
                  <span className="previsao__data">{d.data.slice(8, 10)}/{d.data.slice(5, 7)}</span>
                </span>
                <span className="previsao__icone" aria-hidden="true">
                  {iconeDoTempo(d.codigo)}
                </span>
                <span className="previsao__texto">{descreverTempo(d.codigo)}</span>
                <span className="previsao__temp">
                  <span className="sr-only">Máxima </span>
                  {formatarNumero(d.maxima)}°
                  <span className="sr-only">, mínima </span>
                  <span className="previsao__min"> / {formatarNumero(d.minima)}°</span>
                </span>
                <span className="previsao__chuva">
                  <span className="sr-only">Chance de chuva </span>
                  {formatarNumero(d.probabilidadeChuva)}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
