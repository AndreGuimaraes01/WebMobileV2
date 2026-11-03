import type { Metadata } from 'next';
import FormularioLocalizacao from '@/components/FormularioLocalizacao';
import Legenda from '@/components/Legenda';
import PlanoCartesiano from '@/components/PlanoCartesiano';
import styles from './plano.module.css';

export const metadata: Metadata = {
  title: 'Plano Cartesiano',
};

export default function Plano() {
  return (
    <>
      <header>
        <h1>Plano Cartesiano</h1>
      </header>

      <section className="view">
        <h2>Visualização de Alertas</h2>
        <p className="page-intro">
          Visualize sua localização (ponto verde) e todos os alertas reportados em um plano com
          coordenadas reais.
        </p>

        <FormularioLocalizacao />

        <section className={styles.mapa}>
          <h3>Mapa de Alertas</h3>
          <PlanoCartesiano />
          <Legenda />
        </section>
      </section>
    </>
  );
}
