/**
 * Leitura e gravação no localStorage.
 * As funções `ler...` servem de getSnapshot para o useSyncExternalStore:
 * devolvem o mesmo objeto enquanto o texto guardado não muda.
 */

import { ehGravidade, ehTipoAlerta, type Alerta, type Localizacao } from './tipos';
import { TITULOS } from './rotulos';

export const CHAVE_ALERTAS = 'radarCidadaoAlerts';
export const CHAVE_LOCALIZACAO = 'userLocation';

// Avisa os providers desta aba; outras abas recebem o evento 'storage' do navegador
const EVENTO_MUDANCA = 'radar-cidadao:armazenamento';

export const SEM_ALERTAS: Alerta[] = [];

function lerTexto(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function lerJSON(texto: string | null): unknown {
  if (texto === null) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: unknown) {
  localStorage.setItem(chave, JSON.stringify(valor));
  window.dispatchEvent(new Event(EVENTO_MUDANCA));
}

function criarLeitor<T>(chave: string, converter: (valor: unknown) => T) {
  let ultimoTexto: string | null | undefined;
  let ultimoValor: T;

  return (): T => {
    const texto = lerTexto(chave);
    if (texto !== ultimoTexto) {
      ultimoTexto = texto;
      ultimoValor = converter(lerJSON(texto));
    }
    return ultimoValor;
  };
}

export function assinar(avisar: () => void): () => void {
  window.addEventListener('storage', avisar);
  window.addEventListener(EVENTO_MUDANCA, avisar);
  return () => {
    window.removeEventListener('storage', avisar);
    window.removeEventListener(EVENTO_MUDANCA, avisar);
  };
}

/* ===== Alertas ===== */

// A versão 2.0 marcava os alertas do usuário com `mine: true` e guardava os dois
// exemplos (alert-1 e alert-2) junto. Os exemplos agora vêm da API, então só
// os alertas do usuário continuam aqui.
function paraAlertaLocal(item: unknown): Alerta | null {
  if (!item || typeof item !== 'object') return null;
  const a = item as Record<string, unknown>;

  const doUsuario = a.mine === true || a.origem === 'local';
  if (!doUsuario || typeof a.id !== 'string' || !ehTipoAlerta(a.type)) return null;
  if (typeof a.latitude !== 'number' || typeof a.longitude !== 'number') return null;

  return {
    id: a.id,
    type: a.type,
    title: typeof a.title === 'string' ? a.title : TITULOS[a.type],
    description: typeof a.description === 'string' ? a.description : '',
    latitude: a.latitude,
    longitude: a.longitude,
    severity: ehGravidade(a.severity) ? a.severity : 'moderate',
    timestamp: typeof a.timestamp === 'number' ? a.timestamp : 0,
    origem: 'local',
  };
}

export const lerAlertasLocais = criarLeitor(CHAVE_ALERTAS, (valor): Alerta[] => {
  if (!Array.isArray(valor)) return SEM_ALERTAS;
  return valor.map(paraAlertaLocal).filter((a): a is Alerta => a !== null);
});

export function salvarAlertasLocais(alertas: Alerta[]) {
  gravar(CHAVE_ALERTAS, alertas);
}

/* ===== Localização ===== */

export const lerLocalizacao = criarLeitor(CHAVE_LOCALIZACAO, (valor): Localizacao | null => {
  if (!valor || typeof valor !== 'object') return null;
  const l = valor as Record<string, unknown>;
  if (typeof l.latitude !== 'number' || typeof l.longitude !== 'number') return null;

  return {
    latitude: l.latitude,
    longitude: l.longitude,
    manual: l.manual === true,
    timestamp: typeof l.timestamp === 'number' ? l.timestamp : 0,
  };
});

export function salvarLocalizacao(localizacao: Localizacao) {
  gravar(CHAVE_LOCALIZACAO, localizacao);
}
