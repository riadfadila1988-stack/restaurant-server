"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_model_1 = __importDefault(require("./employee.model"));
class EmployeeService {
    async findAll(restaurantId) {
        try {
            return await employee_model_1.default.find({ restaurantId });
        }
        catch (err) {
            throw err;
        }
    }
    async create(employee, restaurantId) {
        try {
            return await employee_model_1.default.create({ ...employee, restaurantId, _id: undefined });
        }
        catch (err) {
            throw err;
        }
    }
    async getEmployeeByCode(code, restaurantId) {
        try {
            return await employee_model_1.default.findOne({ code, restaurantId });
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = new EmployeeService();
