import { CORES } from '@/lib/rotulos';
import styles from './Legenda.module.css';

// Mesmas cores do canvas em PlanoCartesiano
const ITENS = [
  { rotulo: 'Você', cor: CORES.user, classe: `${styles.ponto} ${styles.voce}` },
  { rotulo: 'Alagamento', cor: CORES.agua, classe: styles.ponto },
  { rotulo: 'Lixo', cor: CORES.lixo, classe: styles.ponto },
  { rotulo: 'Urgente', cor: CORES.urgent, classe: styles.ponto },
];

export default function Legenda() {
  return (
    <ul className={styles.legenda}>
      {ITENS.map((item) => (
        <li key={item.rotulo}>
          <span className={item.classe} style={{ background: item.cor }} aria-hidden="true" />
          {item.rotulo}
        </li>
      ))}
    </ul>
  );
}
