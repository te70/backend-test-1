import { Router } from 'express';
import UserController from '../../controllers/UserController';

import AuthenticationMiddleware from '../../middlewares/AuthenticationMiddleware';

const router = Router();

router.get('/', UserController.findUsers);
router.get('/:id', UserController.getUser);
router.post('/', UserController.createUser);
router.patch('/:id', UserController.updateUser);
router.delete('/:id', AuthenticationMiddleware(), UserController.deleteUser);

export default router;