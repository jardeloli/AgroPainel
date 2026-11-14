import { useEffect, useState } from 'react'
import { buscarClima } from '../servicos/clima'
import type { Clima, Municipio } from '../tipos'

export type EstadoClima =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'sucesso'; clima: Clima }

type Resultado = Exclude<EstadoClima, { status: 'carregando' }>

/**
 * RC06: o efeito depende do município; quando ele muda, roda de novo.
 * A requisição anterior é cancelada na limpeza do efeito (AbortController),
 * assim a resposta mais lenta nunca sobrescreve a da cidade atual.
 */
export function useClima(municipio: Municipio) {
  const [tentativa, setTentativa] = useState(0)
  const [guardado, setGuardado] = useState<{ chave: string; resultado: Resultado } | null>(null)

  const chave = `${municipio.id}#${tentativa}`

  useEffect(() => {
    const controlador = new AbortController()

    buscarClima(municipio, controlador.signal)
      .then((clima) => setGuardado({ chave, resultado: { status: 'sucesso', clima } }))
      .catch((erro: unknown) => {
        if (controlador.signal.aborted) return
        const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido ao buscar o clima.'
        setGuardado({ chave, resultado: { status: 'erro', mensagem } })
      })

    return () => controlador.abort()
  }, [chave, municipio])

  // Só vale o resultado da requisição atual; enquanto não chega, está carregando.
  const estado: EstadoClima =
    guardado !== null && guardado.chave === chave ? guardado.resultado : { status: 'carregando' }

  return { estado, tentarNovamente: () => setTentativa((n) => n + 1) }
}
