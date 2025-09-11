import BaseController from "../../core/base.controller";
import EmployeeService from "./employee.service";
import {Request, Response} from "express";

class EmployeeController extends BaseController{
    async create(req: Request, res: Response){
        try {
            // Placeholder for employee creation logic
            const restaurantId = (req as any).restaurantId as string;
            const newEmployee = await EmployeeService.create(req.body, restaurantId);
            this.handleSuccess(res, newEmployee);
        } catch (e) {
            this.handleError(res, 'Failed to create employee');
        }
    }
    async getAll(req: Request, res: Response){
        try {
            const restaurantId = (req as any).restaurantId as string;
            const employees = await EmployeeService.findAll(restaurantId);
            this.handleSuccess(res, employees);
        } catch (e) {
            this.handleError(res, 'Failed to get employees');
        }
    }
}

export default new EmployeeController();