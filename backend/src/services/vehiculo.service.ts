import { PrismaClient, Rol } from '@prisma/client';

const prisma = new PrismaClient();

interface UsuarioActual {
  id: string;
  rol: Rol;
}

export async function crearVehiculo(
  usuarioActual: UsuarioActual,
  datos: { patente: string; marca: string; modelo: string; anio: number; kmActual: number; usuarioId?: string }
) {
  // Si es DUENIO, solo puede crear vehículos para sí mismo (ignoramos cualquier usuarioId que mande)
  const usuarioId = usuarioActual.rol === 'DUENIO' ? usuarioActual.id : (datos.usuarioId || usuarioActual.id);

  return prisma.vehiculo.create({
    data: {
      patente: datos.patente,
      marca: datos.marca,
      modelo: datos.modelo,
      anio: datos.anio,
      kmActual: datos.kmActual,
      usuarioId,
    },
  });
}

export async function listarVehiculos(usuarioActual: UsuarioActual) {
  // ADMIN y MECANICO ven todos; DUENIO solo los propios
  if (usuarioActual.rol === 'DUENIO') {
    return prisma.vehiculo.findMany({ where: { usuarioId: usuarioActual.id } });
  }
  return prisma.vehiculo.findMany();
}

export async function obtenerVehiculoPorId(usuarioActual: UsuarioActual, id: string) {
  const vehiculo = await prisma.vehiculo.findUnique({ where: { id } });
  if (!vehiculo) throw new Error('Vehículo no encontrado');

  if (usuarioActual.rol === 'DUENIO' && vehiculo.usuarioId !== usuarioActual.id) {
    throw new Error('No autorizado para ver este vehículo');
  }

  return vehiculo;
}

export async function actualizarVehiculo(
  usuarioActual: UsuarioActual,
  id: string,
  datos: Partial<{ marca: string; modelo: string; anio: number; kmActual: number }>
) {
  const vehiculo = await prisma.vehiculo.findUnique({ where: { id } });
  if (!vehiculo) throw new Error('Vehículo no encontrado');

  if (usuarioActual.rol === 'DUENIO' && vehiculo.usuarioId !== usuarioActual.id) {
    throw new Error('No autorizado para editar este vehículo');
  }

  return prisma.vehiculo.update({ where: { id }, data: datos });
}

export async function borrarVehiculo(id: string) {
  // El control de "solo ADMIN" ya lo hace el middleware de rutas, acá no hace falta repetirlo
  return prisma.vehiculo.delete({ where: { id } });
}