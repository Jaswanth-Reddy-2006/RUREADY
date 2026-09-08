import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router: Router = Router();

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/resume', upload.single('resume'), userController.uploadResume);

export default router;
