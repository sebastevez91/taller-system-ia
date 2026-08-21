import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function crearNotificacionesRiesgoAlto(
  vehiculoId: string,
  componenteId: string,
  componenteNombre: string,
  scoreRiesgo: number
) {
  // ¿Ya hay una notificación sin leer para este mismo vehículo+componente?
  const yaNotificado = await prisma.notificacion.findFirst({
    where: { vehiculoId, componenteId, leida: false },
  });

  if (yaNotificado) return; // no duplicamos mientras siga pendiente

  const destinatarios = await prisma.usuario.findMany({
    where: { rol: { in: ['ADMIN', 'MECANICO'] } },
  });

  const mensaje = `Riesgo alto (${(scoreRiesgo * 100).toFixed(0)}%) en ${componenteNombre}`;

  await prisma.notificacion.createMany({
    data: destinatarios.map((u) => ({
      usuarioId: u.id,
      mensaje,
      vehiculoId,
      componenteId,
    })),
  });
}

export async function listarNotificaciones(usuarioId: string) {
  return prisma.notificacion.findMany({
    where: { usuarioId },
    orderBy: { creadaEn: 'desc' },
    take: 20,
  });
}

export async function marcarComoLeida(id: string) {
  return prisma.notificacion.update({ where: { id }, data: { leida: true } });
}

export async function contarNoLeidas(usuarioId: string) {
  return prisma.notificacion.count({ where: { usuarioId, leida: false } });
}