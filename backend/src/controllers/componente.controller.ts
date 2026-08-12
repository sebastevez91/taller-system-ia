import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  crearComponente,
  listarComponentes,
  obtenerComponentePorId,
  actualizarComponente,
  borrarComponente,
} from '../services/componente.service';

export async function crear(req: AuthRequest, res: Response) {
  try {
    const componente = await crearComponente(req.body);
    res.status(201).json(componente);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el componente' });
  }
}

export async function listar(_req: AuthRequest, res: Response) {
  const componentes = await listarComponentes();
  res.json(componentes);
}

export async function obtener(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const componente = await obtenerComponentePorId(req.params.id);
    res.json(componente);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function actualizar(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const componente = await actualizarComponente(req.params.id, req.body);
    res.json(componente);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function borrar(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    await borrarComponente(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Componente no encontrado' });
  }
}