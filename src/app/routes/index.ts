import { Router } from 'express';
import { UserRoutes } from '../../modules/Users/user.route';
import { AuthRoutes } from '../../modules/Auth/auth.route';
import { CustomerRoutes } from '../../modules/Customers/customer.route';
import { ProductRoutes } from '../../modules/Products/product.route';
import { ServiceRoutes } from '../../modules/Services/service.route';
import { CategoryRoutes } from '../../modules/Category/category.route';

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
  {
    path: '/customers',
    route: CustomerRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
];

// Register routes properly
moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;

