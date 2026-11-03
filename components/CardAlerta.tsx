import { formatarCoordenadas, tempoAtras } from '@/lib/formatar';
import { GRAVIDADES, ICONES } from '@/lib/rotulos';
import type { Alerta } from '@/lib/tipos';
import styles from './CardAlerta.module.css';

interface Props {
  alerta: Alerta;
  agora: number;
}

export default function CardAlerta({ alerta, agora }: Props) {
  const gravidade = GRAVIDADES[alerta.severity];

  return (
    <li className={styles.card}>
      <span className={styles.icone} aria-hidden="true">
        {ICONES[alerta.type]}
      </span>

      <article className={styles.info}>
        <h4>
          {alerta.title} <span className={gravidade.classe}>{gravidade.rotulo}</span>
        </h4>

        {alerta.distance !== undefined && (
          <p>A {Math.round(alerta.distance * 1000)} m de você</p>
        )}

        <time dateTime={new Date(alerta.timestamp).toISOString()}>
          {tempoAtras(alerta.timestamp, agora)}
        </time>

        <details>
          <summary>Ver detalhes</summary>
          {/* o JSX escapa o texto, então a descrição digitada nunca vira HTML */}
          <p>{alerta.description || 'Sem descrição.'}</p>
          <p>Coordenadas: {formatarCoordenadas(alerta.latitude, alerta.longitude)}</p>
        </details>
      </article>
    </li>
  );
}
