// "Agora mesmo", "Há 5 min", "Há 2h", "Há 3d"
export function tempoAtras(timestamp: number, agora: number): string {
  const minutos = Math.floor((agora - timestamp) / 60000);
  if (minutos < 1) return 'Agora mesmo';
  if (minutos < 60) return `Há ${minutos} min`;
  if (minutos < 1440) return `Há ${Math.floor(minutos / 60)}h`;
  return `Há ${Math.floor(minutos / 1440)}d`;
}

export function formatarCoordenadas(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
