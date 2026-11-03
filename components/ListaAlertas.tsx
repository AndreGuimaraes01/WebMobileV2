'use client';

import { useId, useState } from 'react';
import { useAgora } from '@/hooks/useAgora';
import { useAlertas } from '@/hooks/useAlertas';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import { ehTipoAlerta, type TipoAlerta } from '@/lib/tipos';
import CardAlerta from './CardAlerta';
import styles from './ListaAlertas.module.css';

const RAIO_KM = 2;

type Filtro = 'todos' | TipoAlerta;

export default function ListaAlertas() {
  const { localizacao, carregada } = useLocalizacao();
  const { proximos, erroApi } = useAlertas();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const agora = useAgora();
  const id = useId();

  const naRegiao = localizacao
    ? proximos(localizacao.latitude, localizacao.longitude, RAIO_KM)
    : [];
  const exibidos = filtro === 'todos' ? naRegiao : naRegiao.filter((a) => a.type === filtro);

  let vazio: string | null = null;
  if (!carregada) vazio = 'Aguardando localização...';
  else if (!localizacao) vazio = '📍 Defina sua localização em "Plano" para ver os alertas.';
  else if (exibidos.length === 0) vazio = '✨ Nenhum alerta nesta região no momento';

  return (
    <>
      <form className={styles.filtro} onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={id}>Filtrar por tipo</label>
        <select
          id={id}
          value={filtro}
          onChange={(e) => {
            const valor = e.target.value;
            setFiltro(ehTipoAlerta(valor) ? valor : 'todos');
          }}
        >
          <option value="todos">Todos</option>
          <option value="agua">Alagamento</option>
          <option value="lixo">Lixo</option>
        </select>
      </form>

      {erroApi && <output className="report-status erro">{erroApi}</output>}

      <ul className={styles.lista}>
        {vazio ? (
          <li className={styles.vazio}>{vazio}</li>
        ) : (
          exibidos.map((alerta) => <CardAlerta key={alerta.id} alerta={alerta} agora={agora} />)
        )}
      </ul>

      <footer className={styles.resumo}>
        <p>
          <strong>{naRegiao.length}</strong> alertas ativos na sua região
        </p>
      </footer>
    </>
  );
}
