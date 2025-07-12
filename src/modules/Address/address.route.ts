import express from 'express';
import { ShippingAddressControllers } from './address.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { shippingAddressValidationSchemas } from './address.validation';

const router = express.Router();


router.post(
  '/create-address',
  validateRequest(shippingAddressValidationSchemas.createShippingAddressSchema),
  ShippingAddressControllers.createShippingAddress
);


router.get('/', ShippingAddressControllers.getUserShippingAddresses);

router.delete('/:id', ShippingAddressControllers.deleteShippingAddress);

router.get('/:id', ShippingAddressControllers.getShippingAddressById);


router.put(
  '/:id',
  validateRequest(shippingAddressValidationSchemas.updateShippingAddressSchema), 
  ShippingAddressControllers.updateShippingAddress
);

export const ShippingAddressRoutes = router;
