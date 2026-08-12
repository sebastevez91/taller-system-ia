import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/auth.middleware';
import { crear, listar, obtener, actualizar, borrar } from '../controllers/vehiculo.controller';

const router = Router();

router.use(verificarToken); // todas las rutas de acá abajo requieren estar logueado

router.post('/', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), crear);
router.get('/', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), listar);
router.get('/:id', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), obtener);
router.put('/:id', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), actualizar);
router.delete('/:id', permitirRoles('ADMIN'), borrar);

export default router;