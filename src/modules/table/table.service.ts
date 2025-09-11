import {ITable} from "./table.interface";
import TableModel from "./table.model";
import {Types} from "mongoose";

class TableService {
    async addTables(tables: ITable[]): Promise< Types.ObjectId[]> {
        const newTables = await TableModel.insertMany(tables);
        return newTables.map((table) => table._id);
    }
    async getTableBuId(id: string | Types.ObjectId): Promise<ITable | null> {
        return await TableModel.findById(id).lean() as ITable;
    }

    async updateTables(tables: ITable[]): Promise<void> {
        const promises = tables.map(table => {
            if (table._id) {
                return TableModel.findByIdAndUpdate(table._id, {
                    x: table.x,
                    y: table.y,
                    width: table.width,
                    height: table.height,
                });
            }
            return Promise.resolve();
        });
        await Promise.all(promises);
    }
}
export default new TableService();