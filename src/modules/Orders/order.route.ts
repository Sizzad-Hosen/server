import express from "express";
import { OrderControllers } from "./order.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { createOrderSchema } from "./order.validation";
import auth from "../../app/middlewares/auth";

const router = express.Router();

router.post("/", OrderControllers.createOrderHandler);

export const OrderRoutes = router;
