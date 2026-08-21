import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { listarNotificaciones, marcarComoLeida, contarNoLeidas } from '../services/notificacion.service';

export async function listar(req: AuthRequest, res: Response) {
  const notificaciones = await listarNotificaciones(req.usuario!.id);
  res.json(notificaciones);
}

export async function contarNoLeidasController(req: AuthRequest, res: Response) {
  const cantidad = await contarNoLeidas(req.usuario!.id);
  res.json({ cantidad });
}

export async function marcarLeida(req: AuthRequest<{ id: string }>, res: Response) {
  await marcarComoLeida(req.params.id);
  res.status(204).send();
}