import { NextResponse } from 'next/server';
import { buscarAlerta } from '@/lib/alertas-servidor';

// GET /api/alertas/:id
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const alerta = buscarAlerta(id);

  if (!alerta) {
    return NextResponse.json({ erro: `Alerta '${id}' não encontrado.` }, { status: 404 });
  }

  return NextResponse.json(alerta);
}
