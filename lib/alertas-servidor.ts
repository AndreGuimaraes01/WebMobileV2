import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { filtrarPorRaio } from './distancia';
import { ehGravidade, ehTipoAlerta, type Alerta, type TipoAlerta } from './tipos';

const ARQUIVO = path.join(process.cwd(), 'data', 'alertas.json');

// Aceita só os itens com todos os campos certos; um item quebrado não derruba a lista
function paraAlerta(item: unknown): Alerta | null {
  if (!item || typeof item !== 'object') return null;
  const a = item as Record<string, unknown>;

  if (typeof a.id !== 'string' || !ehTipoAlerta(a.type) || !ehGravidade(a.severity)) return null;
  if (typeof a.title !== 'string' || typeof a.description !== 'string') return null;
  if (typeof a.latitude !== 'number' || typeof a.longitude !== 'number') return null;
  if (typeof a.timestamp !== 'number') return null;

  return {
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description,
    latitude: a.latitude,
    longitude: a.longitude,
    severity: a.severity,
    timestamp: a.timestamp,
    origem: 'api',
  };
}

// O JSON é lido a cada requisição, e não importado, para o app não depender dele:
// sem o arquivo (ou com ele inválido) a API responde uma lista vazia.
async function lerAlertas(): Promise<Alerta[]> {
  try {
    const dados: unknown = JSON.parse(await readFile(ARQUIVO, 'utf8'));
    if (!Array.isArray(dados)) throw new Error('o conteúdo não é uma lista');
    return dados.map(paraAlerta).filter((alerta): alerta is Alerta => alerta !== null);
  } catch (erro) {
    console.warn('data/alertas.json indisponível, API sem alertas de exemplo:', erro);
    return [];
  }
}

export interface FiltroAlertas {
  tipo?: TipoAlerta;
  perto?: { latitude: number; longitude: number; raioKm: number };
}

export async function listarAlertas({ tipo, perto }: FiltroAlertas = {}): Promise<Alerta[]> {
  let alertas = await lerAlertas();

  if (tipo) alertas = alertas.filter((alerta) => alerta.type === tipo);
  if (perto) {
    alertas = filtrarPorRaio(alertas, perto.latitude, perto.longitude, perto.raioKm);
  }

  return alertas;
}

export async function buscarAlerta(id: string): Promise<Alerta | undefined> {
  return (await lerAlertas()).find((alerta) => alerta.id === id);
}
