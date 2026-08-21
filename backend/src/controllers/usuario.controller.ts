import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { listarUsuarios, cambiarRol } from '../services/usuario.service';

export async function listar(_req: AuthRequest, res: Response) {
  const usuarios = await listarUsuarios();
  res.json(usuarios);
}

export async function actualizarRol(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const usuario = await cambiarRol(req.params.id, req.body.rol);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar el rol' });
  }
}