import { Router } from 'express';
import { UserRoutes } from '../../modules/Users/user.route';
import { AuthRoutes } from '../../modules/Auth/auth.route';

const router = Router();

// Define all module routes here
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

// Register routes properly
moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
