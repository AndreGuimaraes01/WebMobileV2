import type { Gravidade, TipoAlerta } from './tipos';

export const TITULOS: Record<TipoAlerta, string> = {
  agua: 'Alagamento',
  lixo: 'Acúmulo de Lixo',
};

export const TITULOS_FORMULARIO: Record<TipoAlerta, string> = {
  agua: 'Reportar Alagamento',
  lixo: 'Reportar Acúmulo de Lixo',
};

export const ICONES: Record<TipoAlerta, string> = {
  agua: '💧',
  lixo: '🗑️',
};

// Usadas no canvas (PlanoCartesiano) e na Legenda
export const CORES = {
  user: '#4CAF50',
  agua: '#00a8e1',
  lixo: '#ff9800',
  urgent: '#ff4444',
} as const;

// `classe` são as classes globais de globals.css
export const GRAVIDADES: Record<Gravidade, { rotulo: string; classe: string }> = {
  low: { rotulo: '🟢 Leve', classe: 'badge' },
  moderate: { rotulo: '🟡 Moderado', classe: 'badge badge-warning' },
  urgent: { rotulo: '🔴 Urgente', classe: 'badge badge-urgent' },
};
