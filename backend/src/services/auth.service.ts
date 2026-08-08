import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, Rol } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function registrarUsuario(nombre: string, email: string, password: string, rol: Rol) {
  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, email, passwordHash, rol },
  });

  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
}

export async function loginUsuario(email: string, password: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error('Credenciales inválidas');

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } };
}