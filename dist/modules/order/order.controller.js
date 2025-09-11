"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base.controller"));
const order_service_1 = __importDefault(require("./order.service"));
const sockets_1 = require("../../utils/sockets");
class OrderController extends base_controller_1.default {
    async getById(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const order = await order_service_1.default.getOrderById(req.params.id, restaurantId);
            if (!order) {
                this.handleError(res, 'Order not found', 404);
                return;
            }
            this.handleSuccess(res, order);
        }
        catch (e) {
            this.handleError(res, 'Failed to get order');
        }
    }
    async add(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const newOrder = await order_service_1.default.addNewTableOrder({ ...req.body, restaurantId });
            if (newOrder.type === 'delivery' || newOrder.type === 'takeaway') {
                await (0, sockets_1.broadcastOrdersUpdate)(restaurantId);
            }
            else if (newOrder.type === 'table') {
                await (0, sockets_1.broadcastLiveTablesUpdate)(restaurantId);
            }
            this.handleSuccess(res, newOrder);
        }
        catch (e) {
            console.error(e);
            this.handleError(res, 'Failed to add food');
        }
    }
    async closeOrderByTableId(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const closed = await order_service_1.default.closeOrderByTableId(req.params.id, restaurantId);
            this.handleSuccess(res, closed);
            await (0, sockets_1.broadcastLiveTablesUpdate)(restaurantId);
        }
        catch (e) {
            this.handleError(res, 'Failed to close order');
        }
    }
    async getOrderByTableId(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const closed = await order_service_1.default.getOrderByTableId(req.params.id, restaurantId);
            this.handleSuccess(res, closed);
        }
        catch (e) {
            this.handleError(res, 'Failed to close order');
        }
    }
    async updateOrder(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const newOrderItems = await order_service_1.default.updateOrder(req.params.id, req.body, restaurantId);
            this.handleSuccess(res, newOrderItems);
            await (0, sockets_1.broadcastLiveTablesUpdate)(restaurantId);
        }
        catch (e) {
            this.handleError(res, 'Failed to close order');
        }
    }
    async getOpenedTakeAwayDeliveryOrder(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const order = await order_service_1.default.getOpenedTakeAwayDeliveryOrder(restaurantId);
            this.handleSuccess(res, order);
        }
        catch (e) {
            this.handleError(res, 'Failed to get order');
        }
    }
    async getOpenedTableOrders(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const orders = await order_service_1.default.getOpenedTableOrders(restaurantId);
            this.handleSuccess(res, orders);
        }
        catch (e) {
            this.handleError(res, 'Failed to get table orders');
        }
    }
    async getPersonsInRestaurant(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const persons = await order_service_1.default.getPersonsInRestaurant(restaurantId);
            this.handleSuccess(res, persons);
        }
        catch (e) {
            this.handleError(res, 'Failed to get persons count');
        }
    }
    async moveOrderToTable(req, res) {
        try {
            const { orderId, targetTableId } = req.body;
            const restaurantId = req.restaurantId;
            const moved = await order_service_1.default.moveOrderToTable(orderId, targetTableId, restaurantId);
            this.handleSuccess(res, moved);
            await (0, sockets_1.broadcastLiveTablesUpdate)(restaurantId);
        }
        catch (e) {
            this.handleError(res, e?.message || 'Failed to move order');
        }
    }
    async print(req, res) {
        try {
            const result = await order_service_1.default.printOrder();
            this.handleSuccess(res, result);
        }
        catch (e) {
            this.handleError(res, 'Failed to print order');
        }
    }
}
exports.default = new OrderController();
