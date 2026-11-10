import { NextResponse, type NextRequest } from 'next/server';
import { listarAlertas, type FiltroAlertas } from '@/lib/alertas-servidor';
import { ehTipoAlerta } from '@/lib/tipos';

const RAIO_PADRAO_KM = 2;

function erro(mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status: 400 });
}

// Number('') é 0, então texto vazio precisa virar NaN
function paraNumero(texto: string | null): number {
  return texto === null || texto.trim() === '' ? NaN : Number(texto);
}

// GET /api/alertas?tipo=agua&lat=-23.55&lon=-46.63&raio=2
export async function GET(request: NextRequest) {
  const busca = request.nextUrl.searchParams;
  const tipo = busca.get('tipo');
  const lat = busca.get('lat');
  const lon = busca.get('lon');
  const raio = busca.get('raio');

  const filtro: FiltroAlertas = {};

  if (tipo !== null) {
    if (!ehTipoAlerta(tipo)) return erro("O parâmetro 'tipo' deve ser 'agua' ou 'lixo'.");
    filtro.tipo = tipo;
  }

  if (lat !== null || lon !== null || raio !== null) {
    if (lat === null || lon === null) return erro("Informe 'lat' e 'lon' juntos.");

    const latitude = paraNumero(lat);
    const longitude = paraNumero(lon);
    const raioKm = raio === null ? RAIO_PADRAO_KM : paraNumero(raio);

    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90) {
      return erro("'lat' deve ser um número entre -90 e 90.");
    }
    if (!Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      return erro("'lon' deve ser um número entre -180 e 180.");
    }
    if (!Number.isFinite(raioKm) || raioKm <= 0) {
      return erro("'raio' deve ser um número maior que zero (em km).");
    }

    filtro.perto = { latitude, longitude, raioKm };
  }

  const alertas = await listarAlertas(filtro);
  return NextResponse.json({ total: alertas.length, alertas });
}
