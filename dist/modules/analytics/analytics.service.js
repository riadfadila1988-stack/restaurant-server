"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("../order/order.model");
class AnalyticsService {
    async getSummary(fromISO, toISO) {
        const from = fromISO ? new Date(fromISO) : new Date(new Date().setHours(0, 0, 0, 0));
        const to = toISO ? new Date(toISO) : new Date();
        const matchStage = {
            $match: {
                createdAt: { $gte: from, $lte: to },
                status: { $ne: "canceled" },
            },
        };
        // Totals and type counts
        const typeAgg = await order_model_1.OrderModel.aggregate([
            matchStage,
            {
                $group: {
                    _id: "$type",
                    orders: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" },
                    persons: { $sum: { $cond: [{ $eq: ["$type", "table"] }, "$persons", 0] } },
                },
            },
        ]);
        let totals = { orders: 0, revenue: 0, persons: 0, table: 0, takeaway: 0, delivery: 0 };
        for (const row of typeAgg) {
            totals.orders += row.orders;
            totals.revenue += row.revenue;
            totals.persons += row.persons;
            if (row._id === "table")
                totals.table = row.orders;
            if (row._id === "takeaway")
                totals.takeaway = row.orders;
            if (row._id === "delivery")
                totals.delivery = row.orders;
        }
        // Sales per food (quantity and revenue)
        const foodSales = await order_model_1.OrderModel.aggregate([
            matchStage,
            { $unwind: "$items" },
            {
                $group: {
                    _id: { foodId: "$items.foodId", name: "$items.name" },
                    quantity: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.totalPrice" },
                },
            },
            { $sort: { quantity: -1 } },
            {
                $project: {
                    _id: 0,
                    foodId: { $toString: "$_id.foodId" },
                    name: "$_id.name",
                    quantity: 1,
                    revenue: 1,
                },
            },
        ]);
        return {
            from: from.toISOString(),
            to: to.toISOString(),
            totals,
            foodSales,
        };
    }
}
exports.default = new AnalyticsService();
