import express from "express";
import { OrderControllers } from "./order.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { createOrderSchema, OrderValidationSchemas } from "./order.validation";
import auth from "../../app/middlewares/auth";

const router = express.Router();


router.post("/create-order",
     auth("admin","customer"),
    validateRequest(OrderValidationSchemas.createOrderSchema),
   OrderControllers.createOrderHandler);

router.get('/track/:invoiceNumber',auth("admin","customer"), OrderControllers.trackOrder);

router.patch('/update-status/:invoiceNumber', 
  auth("admin"),
  validateRequest(OrderValidationSchemas.orderStatusSchema),
  
  OrderControllers.updateOrderStatus);

export const OrderRoutes = router;
