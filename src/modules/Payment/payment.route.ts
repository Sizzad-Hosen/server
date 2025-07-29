import { Router } from "express";


import express from "express";

import { PaymentController } from "./payment.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { PaymentValidationSchemas } from "./payment.validation";

const router = express.Router();

// Payment creation (COD or SSLCommerz)

router.post("/create-payment",validateRequest(PaymentValidationSchemas.createPaymentSchema) ,

PaymentController.createPaymentHandler);

// SSLCommerz Success Callback
router.post("/success/:tran_id", PaymentController.sslPaymentSuccessHandler);

// SSLCommerz Failure Callback
router.post("/fail/:tran_id", PaymentController.sslPaymentFailedHandler);

// Optional: Cancel and IPN routes if needed
router.post("/cancel/:tran_id", (_req, res) => {
  res.redirect(`${process.env.CLIENT_CANCEL_URL || "/"}`);
});

router.post("/ipn", (_req, res) => {
  // You can implement IPN handler if needed
  res.status(200).send("IPN received");
});


export const PaymentRoutes = router;

