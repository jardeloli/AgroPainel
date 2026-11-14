import { NOMES_NIVEL, avaliarPulverizacao } from '../dominio'
import type { Clima } from '../tipos'

const ICONES = { favoravel: '✔', atencao: '!', desfavoravel: '✖' } as const

const FRASES = {
  favoravel: 'As condições de agora estão boas para pulverizar.',
  atencao: 'Há um ponto de atenção antes de pulverizar.',
  desfavoravel: 'Não é um bom momento para pulverizar.',
} as const

export function IndicadorPulverizacao({ clima }: { clima: Clima }) {
  const hoje = clima.dias[0]
  const avaliacao = avaliarPulverizacao({
    vento: clima.atual.vento,
    temperatura: clima.atual.temperatura,
    umidade: clima.atual.umidade,
    precipitacao: clima.atual.precipitacao,
    probabilidadeChuva: hoje?.probabilidadeChuva ?? 0,
  })

  return (
    <section
      className={`pulverizacao pulverizacao--${avaliacao.nivel}`}
      aria-labelledby="titulo-pulverizacao"
    >
      <p className="pulverizacao__pergunta" id="titulo-pulverizacao">
        Pulverização agora
      </p>
      <p className="pulverizacao__nivel">
        <span className="pulverizacao__icone" aria-hidden="true">
          {ICONES[avaliacao.nivel]}
        </span>
        {NOMES_NIVEL[avaliacao.nivel]}
      </p>
      <p>{FRASES[avaliacao.nivel]}</p>
      {avaliacao.motivos.length > 0 && (
        <ul className="pulverizacao__motivos">
          {avaliacao.motivos.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      {hoje === undefined && (
        <p className="pulverizacao__nota">
          Sem previsão para hoje: a probabilidade de chuva não foi considerada.
        </p>
      )}
    </section>
  )
}
