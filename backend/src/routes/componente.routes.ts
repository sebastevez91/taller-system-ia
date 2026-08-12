import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/auth.middleware';
import { crear, listar, obtener, actualizar, borrar } from '../controllers/componente.controller';

const router = Router();

router.use(verificarToken);

router.post('/', permitirRoles('ADMIN'), crear);
router.get('/', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), listar);
router.get('/:id', permitirRoles('ADMIN', 'MECANICO', 'DUENIO'), obtener);
router.put('/:id', permitirRoles('ADMIN'), actualizar);
router.delete('/:id', permitirRoles('ADMIN'), borrar);

export default router;