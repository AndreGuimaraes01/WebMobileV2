import 'server-only';

import dados from '@/data/alertas.json';
import { filtrarPorRaio } from './distancia';
import type { Alerta, TipoAlerta } from './tipos';

type AlertaJson = Omit<Alerta, 'origem' | 'distance'>;

const ALERTAS: Alerta[] = (dados as AlertaJson[]).map((alerta) => ({
  ...alerta,
  origem: 'api',
}));

export interface FiltroAlertas {
  tipo?: TipoAlerta;
  perto?: { latitude: number; longitude: number; raioKm: number };
}

export function listarAlertas({ tipo, perto }: FiltroAlertas = {}): Alerta[] {
  let alertas = tipo ? ALERTAS.filter((alerta) => alerta.type === tipo) : ALERTAS;

  if (perto) {
    alertas = filtrarPorRaio(alertas, perto.latitude, perto.longitude, perto.raioKm);
  }

  return alertas;
}

export function buscarAlerta(id: string): Alerta | undefined {
  return ALERTAS.find((alerta) => alerta.id === id);
}
