export const TIPOS_ALERTA = ['agua', 'lixo'] as const;
export type TipoAlerta = (typeof TIPOS_ALERTA)[number];

export const NIVEIS_GRAVIDADE = ['low', 'moderate', 'urgent'] as const;
export type Gravidade = (typeof NIVEIS_GRAVIDADE)[number];

// 'api' veio de data/alertas.json; 'local' foi criado neste navegador
export type OrigemAlerta = 'api' | 'local';

export interface Alerta {
  id: string;
  type: TipoAlerta;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: Gravidade;
  timestamp: number;
  origem: OrigemAlerta;
  distance?: number; // km, só quando a busca é por proximidade
}

export interface Localizacao {
  latitude: number;
  longitude: number;
  manual: boolean;
  timestamp: number;
}

export function ehTipoAlerta(valor: unknown): valor is TipoAlerta {
  return TIPOS_ALERTA.includes(valor as TipoAlerta);
}

export function ehGravidade(valor: unknown): valor is Gravidade {
  return NIVEIS_GRAVIDADE.includes(valor as Gravidade);
}
