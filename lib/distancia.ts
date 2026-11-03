import type { Alerta } from './tipos';

const RAIO_TERRA_KM = 6371;

// Fórmula de Haversine: distância em km entre dois pontos na superfície da Terra
export function distanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = (graus: number) => (graus * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;

  return RAIO_TERRA_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Alertas a até `raioKm` do ponto, do mais próximo ao mais distante, com `distance` preenchido
export function filtrarPorRaio(
  alertas: Alerta[],
  latitude: number,
  longitude: number,
  raioKm: number,
): Alerta[] {
  return alertas
    .map((alerta) => ({
      ...alerta,
      distance: distanciaKm(latitude, longitude, alerta.latitude, alerta.longitude),
    }))
    .filter((alerta) => alerta.distance <= raioKm)
    .sort((a, b) => a.distance - b.distance);
}
