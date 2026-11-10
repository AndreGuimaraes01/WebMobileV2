'use client';

import { useEffect, useRef, useState } from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import { useLocalizacao } from '@/hooks/useLocalizacao';
import { CORES } from '@/lib/rotulos';
import type { Alerta, Localizacao } from '@/lib/tipos';
import styles from './PlanoCartesiano.module.css';

const MARGEM = 60;
// À esquerda cabem os números da latitude e o nome do eixo, lado a lado
const MARGEM_ESQUERDA = 80;
const ALCANCE = 0.02; // graus para cada lado do usuário (~2 km)
const DIVISOES = 4;

interface Area {
  largura: number;
  altura: number;
}

function estaNaArea(alerta: Alerta, centro: Localizacao) {
  return (
    Math.abs(alerta.latitude - centro.latitude) <= ALCANCE &&
    Math.abs(alerta.longitude - centro.longitude) <= ALCANCE
  );
}

// Converte latitude/longitude em x/y do canvas
function paraPixel(lat: number, lon: number, centro: Localizacao, { largura, altura }: Area) {
  const w = largura - MARGEM_ESQUERDA - MARGEM;
  const h = altura - 2 * MARGEM;
  return {
    x: MARGEM_ESQUERDA + ((lon - (centro.longitude - ALCANCE)) / (2 * ALCANCE)) * w,
    y: MARGEM + ((centro.latitude + ALCANCE - lat) / (2 * ALCANCE)) * h,
  };
}

// Círculo colorido com borda branca
function desenharPonto(ctx: CanvasRenderingContext2D, x: number, y: number, raio: number, cor: string) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Grade, eixos e números das coordenadas
function desenharGrade(ctx: CanvasRenderingContext2D, centro: Localizacao, { largura: W, altura: H }: Area) {
  const p = MARGEM;
  const e = MARGEM_ESQUERDA;
  // Em tela estreita os números da longitude se encostam; aí só metade aparece
  const pularLongitudes = (W - e - p) / DIVISOES < 56;
  ctx.font = '11px sans-serif';

  for (let i = 0; i <= DIVISOES; i++) {
    const x = e + (i * (W - e - p)) / DIVISOES;
    const y = p + (i * (H - 2 * p)) / DIVISOES;

    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, p);
    ctx.lineTo(x, H - p);
    ctx.moveTo(e, y);
    ctx.lineTo(W - p, y);
    ctx.stroke();

    const lon = centro.longitude - ALCANCE + (i * 2 * ALCANCE) / DIVISOES;
    const lat = centro.latitude + ALCANCE - (i * 2 * ALCANCE) / DIVISOES;
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    if (!pularLongitudes || i % 2 === 0) ctx.fillText(lon.toFixed(4), x, H - p + 18);
    ctx.textAlign = 'right';
    ctx.fillText(lat.toFixed(4), e - 6, y + 4);
  }

  // Eixos X e Y
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(e, p);
  ctx.lineTo(e, H - p);
  ctx.lineTo(W - p, H - p);
  ctx.stroke();

  // Nomes dos eixos
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Longitude (Oeste → Leste)', (e + W - p) / 2, H - 12);

  ctx.save();
  ctx.translate(14, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Latitude (Sul → Norte)', 0, 0);
  ctx.restore();
}

function desenhar(ctx: CanvasRenderingContext2D, area: Area, centro: Localizacao | null, alertas: Alerta[]) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, area.largura, area.altura);

  if (!centro) {
    ctx.fillStyle = '#999';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Defina uma localização para ver o mapa', area.largura / 2, area.altura / 2);
    return;
  }

  desenharGrade(ctx, centro, area);

  alertas
    .filter((alerta) => estaNaArea(alerta, centro))
    .forEach((alerta) => {
      const { x, y } = paraPixel(alerta.latitude, alerta.longitude, centro, area);
      const cor = alerta.severity === 'urgent' ? CORES.urgent : CORES[alerta.type];
      desenharPonto(ctx, x, y, 7, cor);
    });

  // Ponto verde do usuário com um anel em volta
  const voce = paraPixel(centro.latitude, centro.longitude, centro, area);
  ctx.strokeStyle = 'rgba(76, 175, 80, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(voce.x, voce.y, 26, 0, 2 * Math.PI);
  ctx.stroke();
  desenharPonto(ctx, voce.x, voce.y, 9, CORES.user);
}

export default function PlanoCartesiano() {
  const { localizacao, carregada } = useLocalizacao();
  const { alertas } = useAlertas();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [largura, setLargura] = useState(0);

  // Acompanha a largura do canvas, que ocupa 100% do espaço disponível
  useEffect(() => {
    const elemento = canvas.current;
    if (!elemento) return;

    const observador = new ResizeObserver(([entrada]) => {
      setLargura(Math.round(entrada.contentRect.width));
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const elemento = canvas.current;
    const ctx = elemento?.getContext('2d');
    if (!elemento || !ctx || largura === 0) return;

    const area = { largura, altura: Math.max(300, Math.round(largura * 0.6)) };
    // Desenha na resolução real da tela, para o traço não ficar borrado
    const escala = window.devicePixelRatio || 1;
    elemento.width = Math.round(area.largura * escala);
    elemento.height = Math.round(area.altura * escala);
    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    desenhar(ctx, area, localizacao, alertas);
  }, [largura, localizacao, alertas]);

  let info = 'Carregando alertas...';
  if (carregada && !localizacao) {
    info = 'Sem localização definida.';
  } else if (localizacao) {
    const visiveis = alertas.filter((alerta) => estaNaArea(alerta, localizacao)).length;
    info = `${alertas.length} alertas no total (${visiveis} visíveis nesta área)`;
  }

  return (
    <>
      <p className={styles.info}>{info}</p>
      <canvas
        ref={canvas}
        className={styles.canvas}
        role="img"
        aria-label="Plano cartesiano com a sua posição e os alertas próximos"
      />
    </>
  );
}
