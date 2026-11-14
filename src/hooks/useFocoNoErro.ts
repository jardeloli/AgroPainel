import { useCallback, useRef } from 'react'

/** RC08: guarda os campos do formulário e leva o foco ao primeiro inválido. */
export function useFocoNoErro<C extends string>(ordem: readonly C[]) {
  const campos = useRef<Partial<Record<C, HTMLElement | null>>>({})

  const registrar = useCallback(
    (campo: C) => (elemento: HTMLElement | null) => {
      campos.current[campo] = elemento
    },
    [],
  )

  const focarPrimeiroComErro = useCallback(
    (erros: Partial<Record<C, string>>) => {
      const primeiro = ordem.find((campo) => erros[campo] !== undefined)
      if (primeiro !== undefined) campos.current[primeiro]?.focus()
    },
    [ordem],
  )

  return { registrar, focarPrimeiroComErro }
}
