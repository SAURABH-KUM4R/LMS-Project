import { Router } from 'express';
import { allPayment, buySubscription, cancleSubscription, getRazorpayApiKey, verifySubscription } from '../controllers/payment.controller.js';
import { authRoles, isLoggedin } from '../middlewares/auth.middleware.js';

const router = Router();

router
    .route('/razorpay-key')
    .get(isLoggedin,getRazorpayApiKey);

router
    .route('/Subscribe')
    .post(isLoggedin,buySubscription);

router
    .route('/verify')
    .post(isLoggedin,verifySubscription)
router
    .route('/unsubscribe')
    .post(isLoggedin,cancleSubscription);

router
    .route('/')
    .get(isLoggedin,authRoles('ADMIN'),allPayment);

export default router