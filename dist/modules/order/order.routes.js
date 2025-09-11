"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("./order.controller"));
const router = (0, express_1.Router)();
router.post('/add', async (req, res) => await order_controller_1.default.add(req, res));
router.put('/closeOrderByTableId/:id', async (req, res) => await order_controller_1.default.closeOrderByTableId(req, res));
router.put('/update/:id', async (req, res) => await order_controller_1.default.updateOrder(req, res));
router.get('/orderByTableId/:id', async (req, res) => await order_controller_1.default.getOrderByTableId(req, res));
router.get('/print', async (req, res) => await order_controller_1.default.print(req, res));
router.get('/order/:id', async (req, res) => await order_controller_1.default.getById(req, res));
router.get('/openedTakeAwayDelivery', async (req, res) => await order_controller_1.default.getOpenedTakeAwayDeliveryOrder(req, res));
router.get('/openedTables', async (req, res) => await order_controller_1.default.getOpenedTableOrders(req, res));
router.get('/persons', async (req, res) => await order_controller_1.default.getPersonsInRestaurant(req, res));
router.post('/moveToTable', async (req, res) => await order_controller_1.default.moveOrderToTable(req, res));
exports.default = router;
