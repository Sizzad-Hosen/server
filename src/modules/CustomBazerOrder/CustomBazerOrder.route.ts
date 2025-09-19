import express from 'express';
import { CustomBazerOrderControllers } from './CustomBazerOrder.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { CustomBazerOrderValidationSchemas } from './CustomBazerOrder.validation';
import auth from '../../app/middlewares/auth';

const router = express.Router();

router.get('/my-custom-orders', auth("admin","customer"), CustomBazerOrderControllers.getAllCustomOrdersByUserIdControllers);

router.delete("/:id",auth(), CustomBazerOrderControllers.handleDeleteSingleOrder);

router.post(
'/create-customBazerOrder',
auth(),
validateRequest(CustomBazerOrderValidationSchemas.createCustomBazerOrder),
CustomBazerOrderControllers.createOrderController
);

router.get('/',auth("admin"), CustomBazerOrderControllers.getOrdersController);

router.get('/:id', CustomBazerOrderControllers.getSingleOrderController);
router.get('/track/:invoiceId', CustomBazerOrderControllers.trackCustomBazarOrder);

router.patch('/status/:invoiceId',
      auth("admin"),
    
     CustomBazerOrderControllers.updateOrderStatusController);


     
router.patch('/update-paymentstatus/:invoiceId', 
  auth("admin"),
  validateRequest(CustomBazerOrderValidationSchemas.orderPaymentStatusSchema),
  
  CustomBazerOrderControllers.updateCustomOrderPaymentController);


export const CustomBazerOrderRoutes = router;