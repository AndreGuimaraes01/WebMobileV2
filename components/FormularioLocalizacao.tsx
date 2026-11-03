'use client';

import { useState, type FormEvent } from 'react';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import { formatarCoordenadas } from '@/lib/formatar';
import styles from './FormularioLocalizacao.module.css';

function mensagemDe(erro: unknown): string {
  return erro instanceof Error ? erro.message : String(erro);
}

export default function FormularioLocalizacao() {
  const { localizacao, carregada, definirManual, usarGPS } = useLocalizacao();
  const [aviso, setAviso] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);

    try {
      definirManual(String(dados.get('latitude')), String(dados.get('longitude')));
      setAviso(null);
    } catch (erro) {
      setAviso(`⚠️ ${mensagemDe(erro)}. Ex.: -23.5505 e -46.6333`);
    }
  }

  async function detectar() {
    setBuscando(true);
    setAviso('📡 Buscando GPS...');

    try {
      await usarGPS();
      setAviso(null);
    } catch (erro) {
      setAviso('Não foi possível usar o GPS: ' + mensagemDe(erro));
    } finally {
      setBuscando(false);
    }
  }

  let status = 'Aguardando localização...';
  let classeStatus = '';
  if (aviso) {
    status = aviso;
  } else if (carregada && localizacao) {
    const origem = localizacao.manual ? 'Manual' : 'GPS';
    status = `Localização atual (${origem}): ${formatarCoordenadas(localizacao.latitude, localizacao.longitude)}`;
    classeStatus = localizacao.manual ? styles.manual : styles.gps;
  }

  return (
    <section className={styles.painel}>
      <h3>Definir Localização</h3>

      <form onSubmit={salvar}>
        {/* a key muda quando a localização muda, e os campos voltam com os valores novos */}
        <fieldset key={localizacao?.timestamp ?? 'vazio'} className={styles.linha}>
          <label>
            Latitude
            <input
              type="number"
              name="latitude"
              placeholder="-23.5505"
              step="any"
              min={-90}
              max={90}
              defaultValue={localizacao?.latitude.toFixed(4)}
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              name="longitude"
              placeholder="-46.6333"
              step="any"
              min={-180}
              max={180}
              defaultValue={localizacao?.longitude.toFixed(4)}
            />
          </label>
        </fieldset>

        <menu className="action-buttons">
          <li>
            <button type="submit" className="btn btn-primary">
              Salvar Localização
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-secondary" onClick={detectar} disabled={buscando}>
              Detectar Localização
            </button>
          </li>
        </menu>
      </form>

      <output className={`${styles.status} ${classeStatus}`} aria-live="polite">
        {status}
      </output>
    </section>
  );
}
