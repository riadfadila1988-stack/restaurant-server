import Layout from './floorLayout.model';
import {ILayout} from "./floorLayout.interface";
import TableService from "../table/table.service";
import {Types} from "mongoose";
import {ITable} from "../table/table.interface";
import {OrderModel} from "../order/order.model";

class FloorLayoutService {
    async getAllLayouts(restaurantId: string): Promise<ILayout[]> {
        try {
            return await Layout.find({restaurantId}).populate('tables')
        } catch (err) {
            throw err;
        }
    }

    async getLayoutById(id: Types.ObjectId, restaurantId?: string): Promise<ILayout | null> {
        try {
            const query: any = {_id: id};
            if (restaurantId) query.restaurantId = restaurantId;
            return await Layout.findOne(query).populate('tables');
        } catch (err) {
            throw err;
        }
    }

    async addLayout(layout: ILayout, restaurantId: string): Promise<ILayout | null> {
        try {
            const rid = new Types.ObjectId(restaurantId);
            const tablesToUpdate = layout.tables.filter(table => !!table._id) as ITable[];
            if (tablesToUpdate.length > 0) {
                await TableService.updateTables(tablesToUpdate);
            }

            const tablesWithRestaurant = (layout.tables.filter(table => !table._id) as ITable[]).map(t => ({
                ...t,
                restaurantId: rid
            }));
            const tablesIds: Types.ObjectId[] = await TableService.addTables(tablesWithRestaurant as ITable[]);
            const newLayout = await Layout.create({
                ...layout,
                restaurantId,
                tables: [...layout.tables.filter(table => !!table._id).map(t => t._id), ...tablesIds]
            })
            if (layout.isCurrent) {
                await this.setCurrentLayout(newLayout._id, restaurantId)
            }
            if (layout.isDefault) {
                await this.setDefaultLayout(newLayout._id, restaurantId)
            }
            return this.getLayoutById(newLayout._id, restaurantId)
        } catch (err) {
            throw err;
        }
    }

    async updateLayout(layout: ILayout, restaurantId: string): Promise<ILayout | null> {
        try {
            if (!layout._id) return null;

            const tablesToUpdate = layout.tables.filter(table => !!table._id) as ITable[];
            if (tablesToUpdate.length > 0) {
                await TableService.updateTables(tablesToUpdate);
            }

            const rid = new Types.ObjectId(restaurantId);
            const tablesWithRestaurant = (layout.tables.filter(table => !table._id) as ITable[]).map(t => ({
                ...t,
                restaurantId: rid
            }));
            const tablesIds: Types.ObjectId[] = await TableService.addTables(tablesWithRestaurant as ITable[]);

            await this.setCurrentLayout(layout._id, restaurantId)
             return  await Layout.findByIdAndUpdate(layout._id, {
                ...layout,
                restaurantId,
                tables: [...layout.tables.filter(table => !!table._id).map(t => t._id), ...tablesIds]
            }, {new: true}).populate('tables');
        } catch (err) {
            throw err;
        }
    }

    async getCurrentLayout(restaurantId: string): Promise<ILayout | null> {
        try {
            const layout = await Layout.findOne({isCurrent: true, restaurantId})
                .populate("tables")
                .lean();

            if (!layout) return null;

            const tableIds = layout.tables.map((t: any) => t._id);

            // get opened orders per table
            const openedOrders = await OrderModel.find({
                tableId: {$in: tableIds},
                status: "opened",
                restaurantId,
            }).select("tableId _id").lean();

            // map tableId -> orderId
            const orderMap = new Map<string, string>();

            for (const o of openedOrders) {
                if (o.tableId && o._id) {
                    orderMap.set(o.tableId.toString(), o._id.toString());
                }
            }

            // Attach orderId to each table
            layout.tables = layout.tables.map((table: any) => ({
                ...table,
                orderId: orderMap.get(table._id.toString()) || "",
            }));

            return layout as ILayout;
        } catch (e) {
            throw e;
        }
    }

    async setCurrentLayout(layoutId: string | Types.ObjectId, restaurantId: string): Promise<void> {
        try {
            await Layout.updateMany({isCurrent: true, restaurantId}, {isCurrent: false});
            await Layout.findByIdAndUpdate(layoutId, {isCurrent: true}, {new: true}).populate('tables');
        } catch (error) {
            throw error;
        }
    }

    async setDefaultLayout(layoutId: string | Types.ObjectId, restaurantId: string) {
        try {
            await Layout.updateMany({isDefault: true, restaurantId}, {isDefault: false});
            await Layout.findByIdAndUpdate(layoutId, {isDefault: true}, {new: true}).populate('tables');
        } catch (error) {
            throw error;
        }
    }

}

export default new FloorLayoutService();