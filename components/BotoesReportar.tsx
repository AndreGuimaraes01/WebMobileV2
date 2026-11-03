'use client';

import { useAlertas } from '@/hooks/useAlertas';
import type { TipoAlerta } from '@/lib/tipos';
import styles from './BotoesReportar.module.css';

const BOTOES: { tipo: TipoAlerta; rotulo: string; classe: string }[] = [
  { tipo: 'agua', rotulo: 'Reportar Alagamento', classe: 'btn btn-primary' },
  { tipo: 'lixo', rotulo: 'Acúmulo de Lixo', classe: 'btn btn-secondary' },
];

interface Props {
  onEscolher: (tipo: TipoAlerta) => void;
}

export default function BotoesReportar({ onEscolher }: Props) {
  const { contagem } = useAlertas();

  return (
    <menu className="action-buttons">
      {BOTOES.map(({ tipo, rotulo, classe }) => {
        const total = contagem[tipo];
        return (
          <li key={tipo}>
            <button type="button" className={classe} onClick={() => onEscolher(tipo)}>
              {rotulo}
              {total > 0 && (
                // a key nova a cada número faz o selo remontar e animar de novo
                <span key={total} className={styles.selo} title={`${total} alertas deste tipo`}>
                  {total}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </menu>
  );
}
