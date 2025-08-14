import express from 'express';
import { ServiceControllers } from './service.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { ServicesValidationSchemas } from './service.validation';
import auth from '../../app/middlewares/auth';

const router = express.Router();

router.post('/create-service',
    auth("admin")
    ,
    validateRequest(ServicesValidationSchemas.CreateService)
    ,
     ServiceControllers.createServiceController);

router.get('/', ServiceControllers.getAllServicesController);


router.get('/:id/full-tree', ServiceControllers.getServiceFullTreeController);


router.put('/:id',   auth("admin"), ServiceControllers.updateServiceController);

router.get('/:id',ServiceControllers.getSingelServiceController);

router.delete('/:id',    auth("admin"),  ServiceControllers.deleteServiceController);

export const ServiceRoutes = router;
