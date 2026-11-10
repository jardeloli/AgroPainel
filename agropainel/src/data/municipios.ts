export interface Municipio {
  nome: string;
  latitude: number;
  longitude: number;
}

export const municipios: Municipio[] = [
  { nome: 'Balsas', latitude: -7.5325, longitude: -46.0356 },
  { nome: 'Riachão', latitude: -7.3619, longitude: -46.6172 },
  { nome: 'Carolina', latitude: -7.3356, longitude: -47.4622 },
  { nome: 'Tasso Fragoso', latitude: -8.4753, longitude: -45.7428 },
  { nome: 'Sambaíba', latitude: -7.1403, longitude: -45.3461 },
  { nome: 'Alto Parnaíba', latitude: -9.1108, longitude: -45.9297 },
  { nome: 'São Raimundo das Mangabeiras', latitude: -7.0219, longitude: -45.4811 },
  { nome: 'Fortaleza dos Nogueiras', latitude: -6.9639, longitude: -46.1772 }
];