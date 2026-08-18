import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generarPrediccion, listarPrediccionesDeVehiculo, generarPrediccionesDeVehiculo } from '../services/prediccion.service';

export async function generar(req: AuthRequest, res: Response) {
  try {
    const { vehiculoId, componenteId } = req.body;
    const prediccion = await generarPrediccion(vehiculoId, componenteId);
    res.status(201).json(prediccion);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'No se pudo generar la predicción' });
  }
}

export async function listarPorVehiculo(req: AuthRequest<{ vehiculoId: string }>, res: Response) {
  const predicciones = await listarPrediccionesDeVehiculo(req.params.vehiculoId);
  res.json(predicciones);
}

export async function generarTodas(req: AuthRequest<{ vehiculoId: string }>, res: Response) {
  const predicciones = await generarPrediccionesDeVehiculo(req.params.vehiculoId);
  res.status(201).json(predicciones);
}