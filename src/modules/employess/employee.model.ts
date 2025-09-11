import {Schema, model} from "mongoose";
import {Employee} from "./employee.interface";

const EmployeeSchema: Schema = new Schema<Employee>({
    name: {type: String, required: true},
    code: {type: String, required: true},
    active: {type: Boolean, default: true},
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
}, {timestamps: true});

// Ensure employee code is unique within a restaurant
EmployeeSchema.index({ restaurantId: 1, code: 1 }, { unique: true });

export default model<Employee>("Employee", EmployeeSchema);
