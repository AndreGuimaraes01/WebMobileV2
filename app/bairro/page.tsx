import type { Metadata } from 'next';
import ListaAlertas from '@/components/ListaAlertas';

export const metadata: Metadata = {
  title: 'Ver Bairro',
};

export default function Bairro() {
  return (
    <>
      <header>
        <h1>Alertas na Região</h1>
      </header>

      <section className="view">
        <p className="page-intro">Problemas num raio de 2km de você</p>
        <ListaAlertas />
      </section>
    </>
  );
}
