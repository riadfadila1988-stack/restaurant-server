"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const order_model_1 = require("./order.model");
const material_service_1 = __importDefault(require("../materials/material.service"));
const net_1 = __importDefault(require("net"));
const employee_service_1 = __importDefault(require("../employess/employee.service"));
const table_service_1 = __importDefault(require("../table/table.service"));
class OrderService {
    /**
     * Add a new order to the database
     * @param orderData - order payload (without _id)
     */
    async addNewTableOrder({ tableId, persons, employeeCode, type, restaurantId, }) {
        const employee = await employee_service_1.default.getEmployeeByCode(employeeCode, restaurantId);
        if (!employee) {
            throw new Error("Employee not found");
        }
        let newOrder;
        if (type === "table") {
            const table = await table_service_1.default.getTableBuId(tableId);
            if (!table) {
                throw new Error("Table not found");
            }
            newOrder = new order_model_1.OrderModel({
                tableId,
                tableName: table.name,
                persons,
                employeeId: employee._id,
                status: "opened",
                type,
                totalPrice: 0,
                items: [],
                restaurantId: new mongoose_1.Types.ObjectId(restaurantId),
            });
        }
        else {
            newOrder = new order_model_1.OrderModel({
                tableId: null,
                tableName: null,
                persons,
                employeeId: employee._id,
                status: "opened",
                type,
                totalPrice: 0,
                items: [],
                restaurantId: new mongoose_1.Types.ObjectId(restaurantId),
            });
        }
        const savedOrder = await newOrder.save();
        return savedOrder;
    }
    /**
     * Get take away delivery orders
     */
    async getOpenedTakeAwayDeliveryOrder(restaurantId) {
        return order_model_1.OrderModel.find({
            type: { $in: ["takeaway", "delivery"] },
            status: 'opened',
            restaurantId,
        }).populate("employeeId", "name").lean();
    }
    /**
     * Get opened table orders (in-restaurant tables)
     */
    async getOpenedTableOrders(restaurantId) {
        return order_model_1.OrderModel.find({
            type: "table",
            status: "opened",
            restaurantId,
        }).populate("employeeId", "name").lean();
    }
    /**
     * Get total persons currently in the restaurant (sum of persons of opened table orders)
     */
    async getPersonsInRestaurant(restaurantId) {
        const orders = await order_model_1.OrderModel.find({ type: "table", status: "opened", restaurantId }).select("persons").lean();
        return orders.reduce((sum, o) => sum + (o.persons || 0), 0);
    }
    /**
     * Get single order by ID
     */
    async getOrderById(orderId, restaurantId) {
        if (!mongoose_1.Types.ObjectId.isValid(orderId))
            throw new Error("Invalid Order ID");
        return order_model_1.OrderModel.findOne({ _id: orderId, restaurantId }).populate("employeeId", "name").lean();
    }
    async closeOrderByTableId(tableId, restaurantId) {
        return await order_model_1.OrderModel.findOneAndUpdate({ tableId, status: 'opened', restaurantId }, { status: 'closed' }, { new: true });
    }
    async getOrderByTableId(tableId, restaurantId) {
        const order = await order_model_1.OrderModel.findOne({ tableId, status: 'opened', restaurantId });
        if (!order) {
            throw new Error("Order not found");
        }
        return order;
    }
    /**
     * Move an opened order to another table (destination must not already have an opened order)
     */
    async moveOrderToTable(orderId, targetTableId, restaurantId) {
        if (!mongoose_1.Types.ObjectId.isValid(orderId) || !mongoose_1.Types.ObjectId.isValid(targetTableId)) {
            throw new Error("Invalid IDs");
        }
        // Ensure order exists and is opened
        const order = await order_model_1.OrderModel.findOne({ _id: orderId, status: 'opened', restaurantId });
        if (!order)
            throw new Error('Order not found or not opened');
        // Ensure destination table exists
        const targetTable = await table_service_1.default.getTableBuId(targetTableId);
        if (!targetTable)
            throw new Error('Destination table not found');
        // Ensure destination has no opened order
        const targetHasOpened = await order_model_1.OrderModel.exists({ tableId: targetTableId, status: 'opened', restaurantId });
        if (targetHasOpened)
            throw new Error('Destination table already has an opened order');
        // Perform move
        order.tableId = new mongoose_1.Types.ObjectId(targetTableId);
        order.tableName = targetTable.name || '';
        const saved = await order.save();
        return saved;
    }
    async updateOrder(orderId, updates, restaurantId) {
        const order = await order_model_1.OrderModel.findOneAndUpdate({ _id: orderId, restaurantId }, updates, { new: true });
        if (!order) {
            throw new Error("Order not found");
        }
        return order.populate("employeeId", "name");
    }
    async consumeIngredients(items) {
        const ingredientsToConsume = items.flatMap(item => {
            const baseIngredients = item.ingredients ?? [];
            const sectionIngredients = item.sections?.flatMap(section => section.options
                .filter(opt => opt.selected)
                .flatMap(opt => opt.ingredients ?? [])) ?? [];
            return [...baseIngredients, ...sectionIngredients];
        });
        await material_service_1.default.decreaseIngredients(ingredientsToConsume);
    }
    async printOrder() {
        // const order = await OrderModel.findById(orderId);
        // if (!order) throw new Error("Order not found");
        const client = new net_1.default.Socket();
        client.connect(9100, '10.0.0.61', () => {
            console.log("Connected to printer");
            let text = '*** ORDER ***\n';
            // order.items.forEach(item => {
            //     text += `${item.quantity}x ${item.name}  ₪${item.totalPrice}\n`;
            //     item.sections?.forEach(section => {
            //         // show only selected or "without" options
            //         const visibleOptions = section.options.filter(opt => {
            //             return (opt.defaultSelected && !opt.selected) || (!opt.defaultSelected && opt.selected);
            //         });
            //         if (visibleOptions.length === 0) return; // skip empty sections
            //
            //         text += `${section.title}:\n`;
            //         visibleOptions.forEach(opt => {
            //             if (opt.defaultSelected && !opt.selected) {
            //                 text += `   - without ${opt.name}\n`;
            //             } else if (!opt.defaultSelected && opt.selected) {
            //                 text += `   - ${opt.name}\n`;
            //             }
            //         });
            //     });
            // });
            //
            // text += "\n\n\n";
            client.write(Buffer.from(text, "utf-8")); // send data
            client.end();
        });
        client.on("error", (err) => {
            console.error("Printer error:", err);
        });
        client.on("close", () => {
            console.log("Printer connection closed");
        });
    }
}
exports.default = new OrderService();
