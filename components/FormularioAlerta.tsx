'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import { GRAVIDADES, TITULOS_FORMULARIO } from '@/lib/rotulos';
import { NIVEIS_GRAVIDADE, ehGravidade, type Gravidade, type TipoAlerta } from '@/lib/tipos';
import styles from './FormularioAlerta.module.css';

interface Props {
  tipo: TipoAlerta;
  onEnviado: () => void;
  onCancelar: () => void;
  onErro: (mensagem: string) => void;
}

export default function FormularioAlerta({ tipo, onEnviado, onCancelar, onErro }: Props) {
  const { localizacao } = useLocalizacao();
  const { adicionar } = useAlertas();
  const [descricao, setDescricao] = useState('');
  const [gravidade, setGravidade] = useState<Gravidade>('moderate');

  const formulario = useRef<HTMLFormElement>(null);
  const campoDescricao = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  // Ao abrir, rola até o formulário e põe o cursor na descrição
  useEffect(() => {
    formulario.current?.scrollIntoView({ behavior: 'smooth' });
    campoDescricao.current?.focus();
  }, []);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const texto = descricao.trim();
    if (!localizacao) {
      onErro('Localização não definida.');
      return;
    }
    if (!texto) {
      onErro('Descreva o problema.');
      return;
    }

    try {
      adicionar({
        type: tipo,
        description: texto,
        severity: gravidade,
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
      });
      onEnviado();
    } catch (erro) {
      console.error('Erro ao salvar alerta:', erro);
      onErro('Erro ao enviar alerta: ' + (erro instanceof Error ? erro.message : String(erro)));
    }
  }

  return (
    <form ref={formulario} className={styles.formulario} onSubmit={enviar}>
      <fieldset>
        <legend>{TITULOS_FORMULARIO[tipo]}</legend>

        <label htmlFor={`${id}-descricao`}>Descrição</label>
        <textarea
          ref={campoDescricao}
          id={`${id}-descricao`}
          rows={3}
          placeholder="Ex: água parada na esquina, altura da calçada..."
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label htmlFor={`${id}-gravidade`}>Gravidade</label>
        <select
          id={`${id}-gravidade`}
          value={gravidade}
          onChange={(e) => {
            if (ehGravidade(e.target.value)) setGravidade(e.target.value);
          }}
        >
          {NIVEIS_GRAVIDADE.map((nivel) => (
            <option key={nivel} value={nivel}>
              {GRAVIDADES[nivel].rotulo}
            </option>
          ))}
        </select>

        <label htmlFor={`${id}-foto`}>Foto (opcional)</label>
        <input type="file" id={`${id}-foto`} accept="image/*" capture="environment" />

        <menu className="action-buttons">
          <li>
            <button type="submit" className="btn btn-primary">
              Enviar Alerta
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          </li>
        </menu>
      </fieldset>
    </form>
  );
}
