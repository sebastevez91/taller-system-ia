import axios from 'axios';

const IA_SERVICE_URL = process.env.IA_SERVICE_URL || 'http://localhost:8001';

interface SolicitudPrediccion {
  componente: string;
  vidaUtilKm: number;
  kmDesdeInstalacion: number;
}

interface RespuestaPrediccion {
  componente: string;
  pct_vida_util: number;
  score_riesgo: number;
  recomendacion: string;
}

export async function consultarRiesgo(solicitud: SolicitudPrediccion): Promise<RespuestaPrediccion> {
  const { data } = await axios.post(`${IA_SERVICE_URL}/predecir`, {
    componente: solicitud.componente,
    vida_util_km: solicitud.vidaUtilKm,
    km_desde_instalacion: solicitud.kmDesdeInstalacion,
  });

  return data;
}