import {Employee} from "./employee.interface";
import EmployeeModel from "./employee.model";

class EmployeeService {
    async findAll(restaurantId: string): Promise<Employee[]> {
        try {
            return await EmployeeModel.find({ restaurantId });
        } catch (err) {
            throw err;
        }
    }
    async create(employee: Employee, restaurantId: string): Promise<Employee> {
        try {
            return await EmployeeModel.create({ ...employee, active: true, restaurantId, _id: undefined });
        } catch (err) {
            throw err;
        }
    }

    async getEmployeeByCode(code: string, restaurantId: string): Promise<Employee | null> {
        try {
            return await EmployeeModel.findOne({ code, restaurantId, active: true });
        }catch (err) {
            throw err;
        }
    }

}

export default new EmployeeService();