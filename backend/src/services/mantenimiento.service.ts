import { PrismaClient, TipoMantenimiento } from '@prisma/client';

const prisma = new PrismaClient();

interface UsuarioActual {
  id: string;
  rol: string;
}

interface DatosMantenimiento {
  vehiculoId: string;
  componenteId: string;
  fecha: Date;
  kmAlMomento: number;
  tipo: TipoMantenimiento;
  descripcion?: string;
  costo: number;
}

export async function crearMantenimiento(datos: DatosMantenimiento) {
  // Transacción: crear el mantenimiento Y actualizar el km del vehículo si corresponde, o ninguna de las dos
  return prisma.$transaction(async (tx) => {
    const mantenimiento = await tx.mantenimiento.create({ data: datos });

    const vehiculo = await tx.vehiculo.findUnique({ where: { id: datos.vehiculoId } });
    if (vehiculo && datos.kmAlMomento > vehiculo.kmActual) {
      await tx.vehiculo.update({
        where: { id: datos.vehiculoId },
        data: { kmActual: datos.kmAlMomento },
      });
    }

    return mantenimiento;
  });
}

export async function listarMantenimientos(usuarioActual: UsuarioActual, vehiculoId?: string) {
  const where: any = {};

  if (vehiculoId) where.vehiculoId = vehiculoId;

  // Si es DUENIO, solo puede ver mantenimientos de sus propios vehículos
  if (usuarioActual.rol === 'DUENIO') {
    where.vehiculo = { usuarioId: usuarioActual.id };
  }

  return prisma.mantenimiento.findMany({
    where,
    include: { componente: true, vehiculo: true },
    orderBy: { fecha: 'desc' },
  });
}

export async function obtenerMantenimientoPorId(usuarioActual: UsuarioActual, id: string) {
  const mantenimiento = await prisma.mantenimiento.findUnique({
    where: { id },
    include: { componente: true, vehiculo: true },
  });
  if (!mantenimiento) throw new Error('Mantenimiento no encontrado');

  if (usuarioActual.rol === 'DUENIO' && mantenimiento.vehiculo.usuarioId !== usuarioActual.id) {
    throw new Error('No autorizado para ver este mantenimiento');
  }

  return mantenimiento;
}

export async function actualizarMantenimiento(id: string, datos: Partial<DatosMantenimiento>) {
  const mantenimiento = await prisma.mantenimiento.findUnique({ where: { id } });
  if (!mantenimiento) throw new Error('Mantenimiento no encontrado');
  return prisma.mantenimiento.update({ where: { id }, data: datos });
}

export async function borrarMantenimiento(id: string) {
  return prisma.mantenimiento.delete({ where: { id } });
}