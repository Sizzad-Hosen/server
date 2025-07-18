import { Request, Response } from "express";
import { OrderServices } from "./order.service";



export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const order = await OrderServices.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed", error });
  }
};



export const OrderControllers = {
  
  createOrderHandler

}