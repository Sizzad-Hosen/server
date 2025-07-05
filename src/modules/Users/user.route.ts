import validateRequest from "../../app/middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { UserValidationSchemas } from "./user.validation";

import  express  from "express";

const router = express.Router();

router.post('/register-user',
    validateRequest(UserValidationSchemas.CreateUserValidation),
     UserControllers.registeredUser)

   export const UserRoutes = router;
   
   