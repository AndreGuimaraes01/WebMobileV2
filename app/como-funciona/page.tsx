import type { Metadata } from 'next';
import { GRAVIDADES, ICONES } from '@/lib/rotulos';
import styles from './como-funciona.module.css';

export const metadata: Metadata = {
  title: 'Como Funciona',
};

const PASSOS = [
  {
    titulo: 'Configure sua Localização',
    texto: (
      <>
        Acesse a aba <strong>&quot;Plano&quot;</strong> (🗺️) para obter sua posição automaticamente
        via GPS do navegador ou insira suas coordenadas (latitude e longitude) manualmente.
      </>
    ),
  },
  {
    titulo: 'Reporte um Problema',
    texto: (
      <>
        Na aba <strong>&quot;Reportar&quot;</strong> (📍), selecione a categoria (💧 Alagamento ou
        🗑️ Lixo), insira a descrição do problema, defina a gravidade e adicione uma foto
        (opcional).
      </>
    ),
  },
  {
    titulo: 'Acompanhe o Bairro',
    texto: (
      <>
        Navegue pela aba <strong>&quot;Ver Bairro&quot;</strong> (📋) para visualizar a lista de
        alertas ativos próximos a você (raio de até 2km), podendo filtrar por tipo de ocorrência.
      </>
    ),
  },
  {
    titulo: 'Visualize no Plano Cartesiano',
    texto: (
      <>
        Consulte no mapa cartesiano da aba <strong>&quot;Plano&quot;</strong> a localização
        espacial do seu ponto e dos alertas cadastrados na região.
      </>
    ),
  },
];

const PERGUNTAS = [
  {
    pergunta: 'Onde os dados dos alertas ficam armazenados?',
    resposta: (
      <>
        Os alertas de exemplo vêm da API do próprio app (<code>/api/alertas</code>). Os alertas que
        você cria ficam guardados no seu navegador, via <em>localStorage</em>, e só aparecem para
        você.
      </>
    ),
  },
  {
    pergunta: 'Como o aplicativo calcula a distância dos alertas?',
    resposta: (
      <>
        A distância entre sua posição e um alerta reportado é calculada através da fórmula de{' '}
        <strong>Haversine</strong>, que considera a curvatura terrestre a partir das coordenadas
        geográficas.
      </>
    ),
  },
  {
    pergunta: 'O que fazer se o GPS não estiver funcionando?',
    resposta: (
      <>
        Você pode informar as coordenadas manualmente na aba <strong>&quot;Plano&quot;</strong>{' '}
        digitando a latitude e longitude da sua localização atual.
      </>
    ),
  },
  {
    pergunta: 'É preciso criar conta para utilizar?',
    resposta: (
      <>
        Não! O Radar Cidadão é 100% aberto e acessível para facilitar o envio imediato de reportes
        por qualquer cidadão sem necessidade de cadastro.
      </>
    ),
  },
];

export default function ComoFunciona() {
  return (
    <>
      <header>
        <h1>📚 Como Funciona</h1>
      </header>

      <section className="view">
        <article className={styles.cartao}>
          <h3>📢 Sobre o Radar Cidadão</h3>
          <p>
            O <strong>Radar Cidadão</strong> é uma plataforma colaborativa desenvolvida para conectar
            comunidades e permitir o registro de problemas urbanos em tempo real, como{' '}
            <strong>alagamentos</strong> e <strong>acúmulo de lixo</strong>.
          </p>
        </article>

        <section className={styles.passos}>
          <h3>🚀 Passo a Passo para Usar</h3>
          <p className={styles.intro}>Aprenda a reportar ocorrências e acompanhar a situação da sua região:</p>

          <ol>
            {PASSOS.map((passo) => (
              <li key={passo.titulo}>
                <h4>{passo.titulo}</h4>
                <p>{passo.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${styles.cartao} ${styles.categorias}`}>
          <h3>🚨 Categorias e Gravidade</h3>
          <p className={styles.intro}>
            Os relatórios recebem sinalizações visuais no feed e no plano conforme o tipo e nível de
            urgência:
          </p>

          <ul className={styles.selos}>
            <li>
              {ICONES.agua} <strong>Alagamento</strong>
            </li>
            <li>
              {ICONES.lixo} <strong>Acúmulo Lixo</strong>
            </li>
            {Object.values(GRAVIDADES).map((gravidade) => (
              <li key={gravidade.rotulo}>
                <span className={gravidade.classe}>{gravidade.rotulo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.faq}>
          <h3>❓ Perguntas Frequentes</h3>
          {PERGUNTAS.map((item) => (
            <details key={item.pergunta}>
              <summary>{item.pergunta}</summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </section>

        <article className={styles.tecnico}>
          <h4>ℹ️ Informações do Projeto</h4>
          <p>
            <strong>Projeto:</strong> Radar Cidadão — Versão 3.0
          </p>
          <p>
            <strong>Tecnologia:</strong> Next.js (App Router), React e TypeScript
          </p>
          <p>
            <strong>Autores:</strong> André Moreira Guimarães &amp; Tomy Boimel
          </p>
        </article>
      </section>

      <footer>
        <p>Radar Cidadão &copy; 2026</p>
      </footer>
    </>
  );
}
