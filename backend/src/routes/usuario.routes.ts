import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/auth.middleware';
import { listar, actualizarRol } from '../controllers/usuario.controller';

const router = Router();

router.use(verificarToken, permitirRoles('ADMIN'));

router.get('/', listar);
router.put('/:id/rol', actualizarRol);

export default router;