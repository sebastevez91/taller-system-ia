import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/auth.middleware';
import { instalar, listarPorVehiculo } from '../controllers/vehiculoComponente.controller';

const router = Router();

router.use(verificarToken);

router.post('/', permitirRoles('ADMIN', 'MECANICO'), instalar);
router.get('/vehiculo/:vehiculoId', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), listarPorVehiculo);

export default router;