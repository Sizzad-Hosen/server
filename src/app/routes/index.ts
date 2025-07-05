import { Router } from 'express'

const router = Router()


const moduleRoutes = [
    {
        path:'/users',
        route:''
    }
]


moduleRoutes.forEach((route)=>route.path, router.route)

export default router;
