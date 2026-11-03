'use client';

import { useLocalizacao } from '@/hooks/useLocalizacao';
import { formatarCoordenadas } from '@/lib/formatar';
import styles from './StatusLocalizacao.module.css';

export default function StatusLocalizacao() {
  const { localizacao, carregada } = useLocalizacao();

  let titulo = 'Aguardando localização...';
  let subtitulo = 'Configure em "Plano"';
  let estado = '';

  if (carregada && !localizacao) {
    titulo = 'Sem localização';
    subtitulo = 'Permita o GPS ou configure em "Plano"';
    estado = styles.erro;
  } else if (localizacao) {
    titulo = `Localizado (${localizacao.manual ? 'Manual' : 'GPS'})`;
    subtitulo = formatarCoordenadas(localizacao.latitude, localizacao.longitude);
    estado = styles.ok;
  }

  return (
    <aside className={`${styles.card} ${estado}`} aria-live="polite">
      <p className={styles.titulo}>{titulo}</p>
      <p className={styles.subtitulo}>{subtitulo}</p>
    </aside>
  );
}
