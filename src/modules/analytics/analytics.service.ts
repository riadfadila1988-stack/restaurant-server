import { OrderModel } from "../order/order.model";
import { Types } from "mongoose";
import { OrderDocument } from "../order/order.interface";
export interface AnalyticsSummary {
  from: string;
  to: string;
  totals: {
    orders: number;
    revenue: number;
    persons: number; // dine-in persons
    table: number;
    takeaway: number;
    delivery: number;
  };
  foodSales: Array<{ foodId: string; name: string; quantity: number; revenue: number }>;
}

export interface TableAnalytics {
  _id: string;
  name: string;
  orders: number;
  persons: number;
}

export interface EmployeeAnalytics {
  _id: string;
  name: string;
  tables: string[];
  foods: Array<{ name: string; quantity: number }>;
}

class AnalyticsService {
  async getSummary(fromISO?: string, toISO?: string): Promise<AnalyticsSummary> {
    const from = fromISO ? new Date(fromISO) : new Date(new Date().setHours(0, 0, 0, 0));
    const to = toISO ? new Date(toISO) : new Date();

    const matchStage = {
      $match: {
        createdAt: { $gte: from, $lte: to },
        status: { $ne: "canceled" },
      },
    } as const;

    // Totals and type counts
    const typeAgg = await OrderModel.aggregate([
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
      if (row._id === "table") totals.table = row.orders;
      if (row._id === "takeaway") totals.takeaway = row.orders;
      if (row._id === "delivery") totals.delivery = row.orders;
    }

    // Sales per food (quantity and revenue)
    const foodSales = await OrderModel.aggregate([
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

  async getTablesSummary(fromISO?: string, toISO?: string): Promise<TableAnalytics[]> {
    const from = fromISO ? new Date(fromISO) : new Date(new Date().setHours(0, 0, 0, 0));
    const to = toISO ? new Date(toISO) : new Date();

    const matchStage = {
      $match: {
        createdAt: { $gte: from, $lte: to },
        status: { $ne: "canceled" },
        type: 'table',
      },
    } as const;

    const tablesAgg = await OrderModel.aggregate([
      matchStage,
      {
        $group: {
          _id: "$tableId",
          orders: { $sum: 1 },
          persons: { $sum: "$persons" },
        },
      },
      {
        $lookup: {
          from: 'tables',
          localField: '_id',
          foreignField: '_id',
          as: 'table',
        },
      },
      {
        $unwind: '$table',
      },
      {
        $project: {
          _id: 1,
          name: "$table.name",
          orders: 1,
          persons: 1,
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    return tablesAgg;
  }

  async getEmployeesSummary(fromISO?: string, toISO?: string): Promise<EmployeeAnalytics[]> {
    const from = fromISO ? new Date(fromISO) : new Date(new Date().setHours(0, 0, 0, 0));
    const to = toISO ? new Date(toISO) : new Date();

    const matchStage = {
      $match: {
        createdAt: { $gte: from, $lte: to },
        status: { $ne: "canceled" },
        employeeId: { $exists: true },
      },
    } as const;

    const employeesAgg = await OrderModel.aggregate([
      matchStage,
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            employeeId: "$employeeId",
            foodName: "$items.name",
          },
          tables: { $addToSet: "$tableId" },
          quantity: { $sum: "$items.quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.employeeId",
          tables: { $first: "$tables" },
          foods: {
            $push: {
              name: "$_id.foodName",
              quantity: "$quantity",
            },
          },
        },
      },
      {
        $lookup: {
          from: 'tables',
          localField: 'tables',
          foreignField: '_id',
          as: 'tableDetails',
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: '$employee',
      },
      {
        $project: {
          _id: 1,
          name: "$employee.name",
          tables: {
            $map: {
              input: "$tableDetails",
              as: "table",
              in: "$$table.name"
            }
          },
          foods: 1,
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    return employeesAgg;
  }

  async getTableOrders(tableId: string, fromISO?: string, toISO?: string): Promise<OrderDocument[]> {
    const from = fromISO ? new Date(fromISO) : new Date(new Date().setHours(0, 0, 0, 0));
    const to = toISO ? new Date(toISO) : new Date();

    const orders = await OrderModel.find({
      tableId: new Types.ObjectId(tableId),
      createdAt: { $gte: from, $lte: to },
      status: { $ne: "canceled" },
    }).sort({ createdAt: -1 });

    return orders;
  }
}

export default new AnalyticsService();
