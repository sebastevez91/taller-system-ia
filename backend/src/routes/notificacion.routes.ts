import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { listar, contarNoLeidasController, marcarLeida } from '../controllers/notificacion.controller';

const router = Router();

router.use(verificarToken);

router.get('/', listar);
router.get('/no-leidas', contarNoLeidasController);
router.put('/:id/leida', marcarLeida);

export default router;