"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const floorLayout_model_1 = __importDefault(require("./floorLayout.model"));
const table_service_1 = __importDefault(require("../table/table.service"));
const mongoose_1 = require("mongoose");
const order_model_1 = require("../order/order.model");
class FloorLayoutService {
    async getAllLayouts(restaurantId) {
        try {
            return await floorLayout_model_1.default.find({ restaurantId }).populate('tables');
        }
        catch (err) {
            throw err;
        }
    }
    async getLayoutById(id, restaurantId) {
        try {
            const query = { _id: id };
            if (restaurantId)
                query.restaurantId = restaurantId;
            return await floorLayout_model_1.default.findOne(query).populate('tables');
        }
        catch (err) {
            throw err;
        }
    }
    async addLayout(layout, restaurantId) {
        try {
            const rid = new mongoose_1.Types.ObjectId(restaurantId);
            const tablesWithRestaurant = layout.tables.map(t => ({ ...t, restaurantId: rid }));
            const tablesIds = await table_service_1.default.addTables(tablesWithRestaurant);
            const newLayout = await floorLayout_model_1.default.create({
                ...layout,
                restaurantId,
                tables: tablesIds
            });
            if (layout.isCurrent) {
                await this.setCurrentLayout(newLayout._id, restaurantId);
            }
            if (layout.isDefault) {
                await this.setDefaultLayout(newLayout._id, restaurantId);
            }
            return this.getLayoutById(newLayout._id, restaurantId);
        }
        catch (err) {
            throw err;
        }
    }
    async getCurrentLayout(restaurantId) {
        try {
            const layout = await floorLayout_model_1.default.findOne({ isCurrent: true, restaurantId })
                .populate("tables")
                .lean();
            if (!layout)
                return null;
            const tableIds = layout.tables.map((t) => t._id);
            // get opened orders per table
            const openedOrders = await order_model_1.OrderModel.find({
                tableId: { $in: tableIds },
                status: "opened",
                restaurantId,
            }).select("tableId _id").lean();
            // map tableId -> orderId
            const orderMap = new Map();
            for (const o of openedOrders) {
                if (o.tableId && o._id) {
                    orderMap.set(o.tableId.toString(), o._id.toString());
                }
            }
            // Attach orderId to each table
            layout.tables = layout.tables.map((table) => ({
                ...table,
                orderId: orderMap.get(table._id.toString()) || "",
            }));
            return layout;
        }
        catch (e) {
            throw e;
        }
    }
    async setCurrentLayout(layoutId, restaurantId) {
        try {
            await floorLayout_model_1.default.updateMany({ isCurrent: true, restaurantId }, { isCurrent: false });
            await floorLayout_model_1.default.findByIdAndUpdate(layoutId, { isCurrent: true }, { new: true }).populate('tables');
        }
        catch (error) {
            throw error;
        }
    }
    async setDefaultLayout(layoutId, restaurantId) {
        try {
            await floorLayout_model_1.default.updateMany({ isDefault: true, restaurantId }, { isDefault: false });
            await floorLayout_model_1.default.findByIdAndUpdate(layoutId, { isDefault: true }, { new: true }).populate('tables');
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new FloorLayoutService();
