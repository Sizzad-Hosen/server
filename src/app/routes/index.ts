import { Router } from 'express';
import { UserRoutes } from '../../modules/Users/user.route';

const router = Router();

// Define all module routes here
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
];

// Register routes properly
moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
