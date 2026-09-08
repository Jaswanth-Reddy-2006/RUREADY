import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';

const router: Router = Router();

router.get('/plans', paymentController.getPlans);
router.post('/checkout', paymentController.createPayment);
router.post('/verify', paymentController.verifyPayment);
router.get('/history', paymentController.getHistory);
router.post('/webhook', paymentController.handleWebhook);

export default router;
