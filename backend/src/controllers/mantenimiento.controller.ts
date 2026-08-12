import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  crearMantenimiento,
  listarMantenimientos,
  obtenerMantenimientoPorId,
  actualizarMantenimiento,
  borrarMantenimiento,
} from '../services/mantenimiento.service';

export async function crear(req: AuthRequest, res: Response) {
  try {
    const mantenimiento = await crearMantenimiento({
      ...req.body,
      fecha: new Date(req.body.fecha),
    });
    res.status(201).json(mantenimiento);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el mantenimiento' });
  }
}

export async function listar(req: AuthRequest, res: Response) {
  const vehiculoId = req.query.vehiculoId as string | undefined;
  const mantenimientos = await listarMantenimientos(req.usuario!, vehiculoId);
  res.json(mantenimientos);
}

export async function obtener(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const mantenimiento = await obtenerMantenimientoPorId(req.usuario!, req.params.id);
    res.json(mantenimiento);
  } catch (error: any) {
    res.status(error.message.includes('no encontrado') ? 404 : 403).json({ error: error.message });
  }
}

export async function actualizar(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const datos = req.body.fecha ? { ...req.body, fecha: new Date(req.body.fecha) } : req.body;
    const mantenimiento = await actualizarMantenimiento(req.params.id, datos);
    res.json(mantenimiento);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function borrar(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    await borrarMantenimiento(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Mantenimiento no encontrado' });
  }
}