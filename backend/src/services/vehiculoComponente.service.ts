import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function instalarComponente(datos: {
  vehiculoId: string;
  componenteId: string;
  fechaInstalacion: Date;
  kmInstalacion: number;
}) {
  return prisma.vehiculoComponente.upsert({
    where: {
      vehiculoId_componenteId: {
        vehiculoId: datos.vehiculoId,
        componenteId: datos.componenteId,
      },
    },
    update: {
      fechaInstalacion: datos.fechaInstalacion,
      kmInstalacion: datos.kmInstalacion,
    },
    create: datos,
  });
}

export async function listarComponentesDeVehiculo(vehiculoId: string) {
  return prisma.vehiculoComponente.findMany({
    where: { vehiculoId },
    include: { componente: true },
  });
}