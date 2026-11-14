/** Baixa um texto como arquivo. O BOM faz o Excel abrir os acentos corretamente. */
export function baixarCsv(nomeArquivo: string, conteudo: string): void {
  const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
