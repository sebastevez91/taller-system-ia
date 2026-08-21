import { PrismaClient } from '@prisma/client';
import { consultarRiesgo } from './ia.service';
import { crearNotificacionesRiesgoAlto } from './notificacion.service';

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

  const prediccion = await prisma.prediccion.create({
    data: {
      vehiculoId,
      componenteId,
      scoreRiesgo: resultado.score_riesgo,
      recomendacion: resultado.recomendacion,
    },
    include: { componente: true },
  });

  if (resultado.score_riesgo >= 0.7) {
    await crearNotificacionesRiesgoAlto(vehiculoId, vehiculoComponente.componenteId, vehiculoComponente.componente.nombre, resultado.score_riesgo);
  }

  return prediccion;
}

export async function listarPrediccionesDeVehiculo(vehiculoId: string) {
  return prisma.prediccion.findMany({
    where: { vehiculoId },
    include: { componente: true },
    orderBy: { fechaGenerada: 'desc' },
  });
}

export async function generarPrediccionesDeVehiculo(vehiculoId: string) {
  const componentesInstalados = await prisma.vehiculoComponente.findMany({
    where: { vehiculoId },
  });

  const predicciones = [];
  for (const vc of componentesInstalados) {
    try {
      const prediccion = await generarPrediccion(vehiculoId, vc.componenteId);
      predicciones.push(prediccion);
    } catch (error) {
      console.error(`Error generando predicción para componente ${vc.componenteId}:`, error);
      // seguimos con los demás componentes aunque uno falle
    }
  }

  return predicciones;
}