'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  SEM_ALERTAS,
  assinar,
  lerAlertasLocais,
  salvarAlertasLocais,
} from '@/lib/armazenamento';
import { filtrarPorRaio } from '@/lib/distancia';
import { TITULOS } from '@/lib/rotulos';
import type { Alerta, Gravidade, TipoAlerta } from '@/lib/tipos';

export interface NovoAlerta {
  type: TipoAlerta;
  description: string;
  severity: Gravidade;
  latitude: number;
  longitude: number;
}

export interface ValorAlertas {
  alertas: Alerta[]; // os da API e os criados neste navegador
  erroApi: string | null;
  contagem: Record<TipoAlerta, number>;
  adicionar: (dados: NovoAlerta) => Alerta;
  proximos: (latitude: number, longitude: number, raioKm: number) => Alerta[];
  meusHoje: () => Alerta[];
}

export const AlertasContext = createContext<ValorAlertas | null>(null);

interface RespostaApi {
  total: number;
  alertas: Alerta[];
}

function adicionar(dados: NovoAlerta): Alerta {
  const alerta: Alerta = {
    id: 'alert-' + Date.now(),
    type: dados.type,
    title: TITULOS[dados.type],
    description: dados.description,
    latitude: dados.latitude,
    longitude: dados.longitude,
    severity: dados.severity,
    timestamp: Date.now(),
    origem: 'local',
  };

  salvarAlertasLocais([...lerAlertasLocais(), alerta]);
  return alerta;
}

export function AlertasProvider({ children }: { children: ReactNode }) {
  const locais = useSyncExternalStore(assinar, lerAlertasLocais, () => SEM_ALERTAS);
  const [daApi, setDaApi] = useState<Alerta[]>(SEM_ALERTAS);
  const [erroApi, setErroApi] = useState<string | null>(null);

  useEffect(() => {
    const controle = new AbortController();

    fetch('/api/alertas', { signal: controle.signal })
      .then((resposta) => {
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        return resposta.json() as Promise<RespostaApi>;
      })
      .then((dados) => setDaApi(dados.alertas))
      .catch((erro) => {
        if (controle.signal.aborted) return;
        console.error('Erro ao buscar alertas da API:', erro);
        setErroApi('Não foi possível carregar os alertas da região. Mostrando só os seus.');
      });

    return () => controle.abort();
  }, []);

  const alertas = useMemo(() => [...daApi, ...locais], [daApi, locais]);

  const contagem = useMemo(() => {
    const total: Record<TipoAlerta, number> = { agua: 0, lixo: 0 };
    alertas.forEach((alerta) => total[alerta.type]++);
    return total;
  }, [alertas]);

  const proximos = useCallback(
    (latitude: number, longitude: number, raioKm: number) =>
      filtrarPorRaio(alertas, latitude, longitude, raioKm),
    [alertas],
  );

  const meusHoje = useCallback(() => {
    const hoje = new Date().toDateString();
    return locais.filter((alerta) => new Date(alerta.timestamp).toDateString() === hoje);
  }, [locais]);

  const valor = useMemo(
    () => ({ alertas, erroApi, contagem, adicionar, proximos, meusHoje }),
    [alertas, erroApi, contagem, proximos, meusHoje],
  );

  return <AlertasContext.Provider value={valor}>{children}</AlertasContext.Provider>;
}
