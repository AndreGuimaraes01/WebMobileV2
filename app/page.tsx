'use client';

import { useState } from 'react';
import BotoesReportar from '@/components/BotoesReportar';
import FormularioAlerta from '@/components/FormularioAlerta';
import StatusLocalizacao from '@/components/StatusLocalizacao';
import { useAlertas } from '@/hooks/useAlertas';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import type { TipoAlerta } from '@/lib/tipos';

interface Mensagem {
  texto: string;
  tipo: 'ok' | 'erro';
}

export default function Reportar() {
  const { localizacao } = useLocalizacao();
  const { meusHoje } = useAlertas();
  const [tipo, setTipo] = useState<TipoAlerta | null>(null);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  function escolher(novoTipo: TipoAlerta) {
    if (!localizacao) {
      setMensagem({ texto: 'Defina sua localização primeiro em "Plano".', tipo: 'erro' });
      return;
    }
    setTipo(novoTipo);
    setMensagem(null);
  }

  function enviado() {
    setTipo(null);
    setMensagem({
      texto: 'Alerta enviado com sucesso! Obrigado por ajudar a comunidade.',
      tipo: 'ok',
    });
  }

  function cancelar() {
    setTipo(null);
    setMensagem(null);
  }

  const totalHoje = meusHoje().length;

  return (
    <>
      <header>
        <h1>Radar Cidadão</h1>
      </header>

      <section className="view">
        <StatusLocalizacao />

        <BotoesReportar onEscolher={escolher} />

        {tipo && (
          <FormularioAlerta
            tipo={tipo}
            onEnviado={enviado}
            onCancelar={cancelar}
            onErro={(texto) => setMensagem({ texto, tipo: 'erro' })}
          />
        )}

        <output className={`report-status ${mensagem?.tipo ?? ''}`} aria-live="polite">
          {mensagem?.texto}
        </output>

        <article>
          <h4>Seus reports hoje</h4>
          <p>
            {totalHoje === 0
              ? 'Você ainda não enviou nenhum alerta.'
              : `Você enviou ${totalHoje} alerta(s) hoje. Obrigado!`}
          </p>
        </article>
      </section>
    </>
  );
}
