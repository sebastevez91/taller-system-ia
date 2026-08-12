import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  crearVehiculo,
  listarVehiculos,
  obtenerVehiculoPorId,
  actualizarVehiculo,
  borrarVehiculo,
} from '../services/vehiculo.service';

export async function crear(req: AuthRequest, res: Response) {
  try {
    const vehiculo = await crearVehiculo(req.usuario!, req.body);
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el vehículo' });
  }
}

export async function listar(req: AuthRequest, res: Response) {
  const vehiculos = await listarVehiculos(req.usuario!);
  res.json(vehiculos);
}

export async function obtener(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const vehiculo = await obtenerVehiculoPorId(req.usuario!, req.params.id);
    res.json(vehiculo);
  } catch (error: any) {
    res.status(error.message.includes('no encontrado') ? 404 : 403).json({ error: error.message });
  }
}

export async function actualizar(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    const vehiculo = await actualizarVehiculo(req.usuario!, req.params.id, req.body);
    res.json(vehiculo);
  } catch (error: any) {
    res.status(error.message.includes('no encontrado') ? 404 : 403).json({ error: error.message });
  }
}

export async function borrar(req: AuthRequest<{ id: string }>, res: Response) {
  try {
    await borrarVehiculo(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Vehículo no encontrado' });
  }
}