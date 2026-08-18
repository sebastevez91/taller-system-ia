import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/auth.middleware';
import { generar, generarTodas, listarPorVehiculo } from '../controllers/prediccion.controller';

const router = Router();

router.use(verificarToken);

router.post('/', permitirRoles('ADMIN', 'MECANICO'), generar);
router.get('/vehiculo/:vehiculoId', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), listarPorVehiculo);
router.post('/vehiculo/:vehiculoId/generar-todas', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), generarTodas);

export default router;