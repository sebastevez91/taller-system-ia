import { PrismaClient, Rol } from '@prisma/client';

const prisma = new PrismaClient();

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    orderBy: { creadoEn: 'desc' },
  });
}

export async function cambiarRol(id: string, nuevoRol: Rol) {
  return prisma.usuario.update({
    where: { id },
    data: { rol: nuevoRol },
    select: { id: true, nombre: true, email: true, rol: true },
  });
}