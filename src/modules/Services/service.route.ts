import express from 'express';
import { ServiceControllers } from './service.controller';

const router = express.Router();

router.post('/create-service', ServiceControllers.createServiceController);

router.get('/', ServiceControllers.getAllServicesController);


router.put('/:id',ServiceControllers.updateServiceController);


router.delete('/:id', ServiceControllers.deleteServiceController);

export const ServiceRoutes = router;
