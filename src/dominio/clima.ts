/** A4: weather_code (padrão OMM) para texto e ícone. */
export function descreverTempo(codigo: number): string {
  if (codigo === 0) return 'Céu limpo'
  if (codigo >= 1 && codigo <= 3) return 'Parcialmente nublado'
  if (codigo === 45 || codigo === 48) return 'Neblina'
  if (codigo >= 51 && codigo <= 57) return 'Garoa'
  if (codigo >= 61 && codigo <= 67) return 'Chuva'
  if (codigo >= 80 && codigo <= 82) return 'Pancadas de chuva'
  if (codigo >= 95 && codigo <= 99) return 'Trovoada'
  return 'Condição desconhecida'
}

export function iconeDoTempo(codigo: number): string {
  if (codigo === 0) return '☀️'
  if (codigo >= 1 && codigo <= 3) return '⛅'
  if (codigo === 45 || codigo === 48) return '🌫️'
  if (codigo >= 51 && codigo <= 57) return '🌦️'
  if (codigo >= 61 && codigo <= 67) return '🌧️'
  if (codigo >= 80 && codigo <= 82) return '🌧️'
  if (codigo >= 95 && codigo <= 99) return '⛈️'
  return '❔'
}
