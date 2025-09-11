"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_routes_1 = __importDefault(require("./modules/categories/categories.routes"));
const floorLayout_routes_1 = __importDefault(require("./modules/floor-layout/floorLayout.routes"));
const food_routes_1 = __importDefault(require("./modules/food/food.routes"));
const printer_routes_1 = __importDefault(require("./modules/printers/printer.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const material_routes_1 = __importDefault(require("./modules/materials/material.routes"));
const employee_routes_1 = __importDefault(require("./modules/employess/employee.routes"));
const restaurant_routes_1 = __importDefault(require("./modules/restaurant/restaurant.routes"));
const apiKeyAuth_1 = require("./core/middlewares/apiKeyAuth");
const router = (0, express_1.Router)();
// Public
router.use('/api/v1/restaurants', restaurant_routes_1.default);
// Protected with API key
router.use('/api/v1/categories', apiKeyAuth_1.apiKeyAuth, categories_routes_1.default);
router.use('/api/v1/layouts', apiKeyAuth_1.apiKeyAuth, floorLayout_routes_1.default);
router.use('/api/v1/food', apiKeyAuth_1.apiKeyAuth, food_routes_1.default);
router.use('/api/v1/printers', apiKeyAuth_1.apiKeyAuth, printer_routes_1.default);
router.use('/api/v1/orders', apiKeyAuth_1.apiKeyAuth, order_routes_1.default);
router.use('/api/v1/analytics', apiKeyAuth_1.apiKeyAuth, analytics_routes_1.default);
router.use('/api/v1/materials', apiKeyAuth_1.apiKeyAuth, material_routes_1.default);
router.use('/api/v1/employees', apiKeyAuth_1.apiKeyAuth, employee_routes_1.default);
exports.default = router;
