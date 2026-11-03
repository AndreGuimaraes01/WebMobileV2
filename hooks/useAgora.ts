import { useSyncExternalStore } from 'react';

const MINUTO = 60_000;

function assinar(avisar: () => void) {
  const id = setInterval(avisar, 15_000);
  return () => clearInterval(id);
}

// Arredonda para o minuto, assim o valor só muda (e a tela só redesenha) uma vez por minuto
function lerAgora() {
  return Math.floor(Date.now() / MINUTO) * MINUTO;
}

// Hora atual para textos como "Há 5 min". No servidor é 0, porque lá não há alertas para mostrar.
export function useAgora(): number {
  return useSyncExternalStore(assinar, lerAgora, () => 0);
}
