import {Router} from "express";
import categoriesRoutes from "./modules/categories/categories.routes";
import floorLayoutRoutes from "./modules/floor-layout/floorLayout.routes";
import foodRoutes from "./modules/food/food.routes";
import printerRoutes from "./modules/printers/printer.routes";
import orderRoutes from "./modules/order/order.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import materialRoutes from "./modules/materials/material.routes";
import employeeRoutes from "./modules/employess/employee.routes";
import restaurantRoutes from "./modules/restaurant/restaurant.routes";
import { apiKeyAuth } from "./core/middlewares/apiKeyAuth";
const router = Router();

// Public
router.use('/api/v1/restaurants', restaurantRoutes);

// Protected with API key
router.use('/api/v1/categories', apiKeyAuth, categoriesRoutes);
router.use('/api/v1/layouts', apiKeyAuth, floorLayoutRoutes);
router.use('/api/v1/food', apiKeyAuth, foodRoutes);
router.use('/api/v1/printers', apiKeyAuth, printerRoutes);
router.use('/api/v1/orders', apiKeyAuth, orderRoutes);
router.use('/api/v1/analytics', apiKeyAuth, analyticsRoutes);
router.use('/api/v1/materials', apiKeyAuth, materialRoutes);
router.use('/api/v1/employees', apiKeyAuth, employeeRoutes);

export default router;
