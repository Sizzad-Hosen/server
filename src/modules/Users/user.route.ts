import validateRequest from "../../app/middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { UserValidationSchemas } from "./user.validation";

import  express  from "express";

const router = express.Router();

function asyncHandler(fn: any) {
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

router.post('/register-user',
    asyncHandler(validateRequest(UserValidationSchemas.CreateUserValidation)),
    asyncHandler(UserControllers.registeredUser))

   export const UserRoutes = router;
   
router.get('/',UserControllers.getAllUserController)