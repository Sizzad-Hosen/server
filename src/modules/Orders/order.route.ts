import express from "express";
import { OrderControllers } from "./order.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import {  OrderValidationSchemas } from "./order.validation";
import auth from "../../app/middlewares/auth";

const router = express.Router();

router.get('/', auth("admin"), OrderControllers.getOrdersController)

router.delete('/:id',auth(), OrderControllers.handleDeleteSingleOrder);

router.post("/create-order",
     auth("admin","customer"),
    validateRequest(OrderValidationSchemas.createOrderSchema),
   OrderControllers.createOrderHandler);
   

router.get('/my-orders', auth("admin","customer"), OrderControllers.getAllOrdersByUserIdControllers);

router.get('/track/:invoiceId',auth("admin","customer"), OrderControllers.trackOrder);   

router.get('/:invoiceId', auth("admin","customer"), OrderControllers.getSingelOrder);


router.patch('/update-status/:invoiceId', 
  auth("admin"),
  validateRequest(OrderValidationSchemas.orderStatusSchema),
  
  OrderControllers.updateOrderStatus);

router.patch('/update-paymentstatus/:invoiceId', 
  auth("admin"),
  validateRequest(OrderValidationSchemas.orderPaymentStatusSchema),
  
  OrderControllers.updateOrderPaymentStatus);

export const OrderRoutes = router;
