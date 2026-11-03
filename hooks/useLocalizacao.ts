import { useContext } from 'react';
import { LocalizacaoContext } from '@/context/LocalizacaoProvider';

export function useLocalizacao() {
  const valor = useContext(LocalizacaoContext);
  if (!valor) throw new Error('useLocalizacao() precisa estar dentro de <LocalizacaoProvider>');
  return valor;
}
