import { Request, Response } from 'express';
import { registrarUsuario, loginUsuario } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await registrarUsuario(nombre, email, password, rol);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo registrar el usuario' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const resultado = await loginUsuario(email, password);
    res.json(resultado);
  } catch (error) {
    console.error('Error inesperado en login:', error);
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
}