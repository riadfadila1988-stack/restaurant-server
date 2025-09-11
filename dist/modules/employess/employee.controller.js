"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base.controller"));
const employee_service_1 = __importDefault(require("./employee.service"));
class EmployeeController extends base_controller_1.default {
    async create(req, res) {
        try {
            // Placeholder for employee creation logic
            const restaurantId = req.restaurantId;
            const newEmployee = await employee_service_1.default.create(req.body, restaurantId);
            this.handleSuccess(res, newEmployee);
        }
        catch (e) {
            this.handleError(res, 'Failed to create employee');
        }
    }
    async getAll(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const employees = await employee_service_1.default.findAll(restaurantId);
            this.handleSuccess(res, employees);
        }
        catch (e) {
            this.handleError(res, 'Failed to get employees');
        }
    }
}
exports.default = new EmployeeController();
