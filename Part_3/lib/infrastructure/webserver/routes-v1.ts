import { Router } from 'express';

import AuthRoutes from '../../interfaces/routes/v1/auth';
import UsersRoutes from '../../interfaces/routes/v1/users';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/users', UsersRoutes);

export default router;
