import { PrismaClient } from '@prisma/client';
import { consultarRiesgo } from './ia.service';

const prisma = new PrismaClient();

export async function generarPrediccion(vehiculoId: string, componenteId: string) {
  const vehiculoComponente = await prisma.vehiculoComponente.findUnique({
    where: { vehiculoId_componenteId: { vehiculoId, componenteId } },
    include: { vehiculo: true, componente: true },
  });

  if (!vehiculoComponente) {
    throw new Error('No hay un componente instalado con esos datos');
  }

  const kmDesdeInstalacion = vehiculoComponente.vehiculo.kmActual - vehiculoComponente.kmInstalacion;

  const resultado = await consultarRiesgo({
    componente: vehiculoComponente.componente.nombre,
    vidaUtilKm: vehiculoComponente.componente.vidaUtilKm,
    kmDesdeInstalacion,
  });

  return prisma.prediccion.create({
    data: {
      vehiculoId,
      componenteId,
      scoreRiesgo: resultado.score_riesgo,
      recomendacion: resultado.recomendacion,
    },
  });
}

export async function listarPrediccionesDeVehiculo(vehiculoId: string) {
  return prisma.prediccion.findMany({
    where: { vehiculoId },
    include: { componente: true },
    orderBy: { fechaGenerada: 'desc' },
  });
}