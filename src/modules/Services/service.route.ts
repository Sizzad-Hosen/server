import express from 'express';
import { ServiceControllers } from './service.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { ServicesValidationSchemas } from './service.validation';

const router = express.Router();

router.post('/create-service',
    validateRequest(ServicesValidationSchemas.CreateService)
    ,
     ServiceControllers.createServiceController);

router.get('/', ServiceControllers.getAllServicesController);


router.put('/:id',ServiceControllers.updateServiceController);


router.delete('/:id', ServiceControllers.deleteServiceController);

export const ServiceRoutes = router;
