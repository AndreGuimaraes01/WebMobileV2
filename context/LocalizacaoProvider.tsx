'use client';

import { createContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { assinar, lerLocalizacao, salvarLocalizacao } from '@/lib/armazenamento';
import type { Localizacao } from '@/lib/tipos';

export interface ValorLocalizacao {
  localizacao: Localizacao | null;
  // false no HTML do servidor e na hidratação: o localStorage ainda não foi lido
  carregada: boolean;
  definirManual: (latitude: string | number, longitude: string | number) => Localizacao;
  usarGPS: () => Promise<Localizacao>;
}

export const LocalizacaoContext = createContext<ValorLocalizacao | null>(null);

function definirManual(latitude: string | number, longitude: string | number): Localizacao {
  const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
  const lon = typeof longitude === 'number' ? longitude : parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error('Coordenadas inválidas');
  }

  const localizacao = { latitude: lat, longitude: lon, manual: true, timestamp: Date.now() };
  salvarLocalizacao(localizacao);
  return localizacao;
}

function usarGPS(): Promise<Localizacao> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS não disponível neste navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        const localizacao = {
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
          manual: false,
          timestamp: Date.now(),
        };
        salvarLocalizacao(localizacao);
        resolve(localizacao);
      },
      (erro) => reject(new Error(erro.message)),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

const semAssinatura = () => () => {};

// O StrictMode roda os efeitos duas vezes em desenvolvimento
let gpsTentado = false;

export function LocalizacaoProvider({ children }: { children: ReactNode }) {
  const localizacao = useSyncExternalStore(assinar, lerLocalizacao, () => null);
  const carregada = useSyncExternalStore(semAssinatura, () => true, () => false);

  // Sem localização salva, tenta o GPS uma vez ao abrir o app
  useEffect(() => {
    if (gpsTentado || lerLocalizacao()) return;
    gpsTentado = true;
    usarGPS().catch(() => {
      console.log('GPS indisponível - use a localização manual em "Plano"');
    });
  }, []);

  const valor = useMemo(
    () => ({ localizacao, carregada, definirManual, usarGPS }),
    [localizacao, carregada],
  );

  return <LocalizacaoContext.Provider value={valor}>{children}</LocalizacaoContext.Provider>;
}
