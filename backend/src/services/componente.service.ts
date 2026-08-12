import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function crearComponente(datos: { nombre: string; vidaUtilKm: number; vidaUtilMeses: number }) {
  return prisma.componente.create({ data: datos });
}

export async function listarComponentes() {
  return prisma.componente.findMany();
}

export async function obtenerComponentePorId(id: string) {
  const componente = await prisma.componente.findUnique({ where: { id } });
  if (!componente) throw new Error('Componente no encontrado');
  return componente;
}

export async function actualizarComponente(
  id: string,
  datos: Partial<{ nombre: string; vidaUtilKm: number; vidaUtilMeses: number }>
) {
  const componente = await prisma.componente.findUnique({ where: { id } });
  if (!componente) throw new Error('Componente no encontrado');
  return prisma.componente.update({ where: { id }, data: datos });
}

export async function borrarComponente(id: string) {
  return prisma.componente.delete({ where: { id } });
}