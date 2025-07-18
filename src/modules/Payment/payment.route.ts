import { Router } from "express";
import { PaymentControllers } from "./payment.controller";


const router = Router();

router.post("/", PaymentControllers.createPaymentHandler);
router.post("/confirm", PaymentControllers.confirmPaymentHandler);

export const PaymentRoutes = router;

