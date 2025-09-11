"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const table_model_1 = __importDefault(require("./table.model"));
class TableService {
    async addTables(tables) {
        const newTables = await table_model_1.default.insertMany(tables);
        return newTables.map((table) => table._id);
    }
    async getTableBuId(id) {
        return await table_model_1.default.findById(id).lean();
    }
}
exports.default = new TableService();
