import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { instalarComponente, listarComponentesDeVehiculo } from '../services/vehiculoComponente.service';

export async function instalar(req: AuthRequest, res: Response) {
  try {
    const resultado = await instalarComponente({
      ...req.body,
      fechaInstalacion: new Date(req.body.fechaInstalacion),
    });
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo registrar la instalación' });
  }
}

export async function listarPorVehiculo(req: AuthRequest<{ vehiculoId: string }>, res: Response) {
  const componentes = await listarComponentesDeVehiculo(req.params.vehiculoId);
  res.json(componentes);
}