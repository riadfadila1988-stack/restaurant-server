"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastOrdersUpdate = broadcastOrdersUpdate;
exports.broadcastLiveTablesUpdate = broadcastLiveTablesUpdate;
const order_service_1 = __importDefault(require("../modules/order/order.service"));
const index_1 = require("../index");
async function broadcastOrdersUpdate(restaurantId) {
    const order = await order_service_1.default.getOpenedTakeAwayDeliveryOrder(restaurantId);
    index_1.io.emit("orders", order);
}
async function broadcastLiveTablesUpdate(restaurantId) {
    const [tableOrders, persons] = await Promise.all([
        order_service_1.default.getOpenedTableOrders(restaurantId),
        order_service_1.default.getPersonsInRestaurant(restaurantId),
    ]);
    index_1.io.emit("tableOrders", tableOrders);
    index_1.io.emit("persons", persons);
}
