import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/auth.middleware';
import { crear, listar, obtener, actualizar, borrar } from '../controllers/mantenimiento.controller';

const router = Router();

router.use(verificarToken);

router.post('/', permitirRoles('ADMIN', 'MECANICO'), crear);
router.get('/', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), listar);
router.get('/:id', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), obtener);
router.put('/:id', permitirRoles('ADMIN', 'MECANICO'), actualizar);
router.delete('/:id', permitirRoles('ADMIN', 'MECANICO'), borrar);

export default router;