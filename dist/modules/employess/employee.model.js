"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EmployeeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    active: { type: Boolean, default: true },
    restaurantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
}, { timestamps: true });
// Ensure employee code is unique within a restaurant
EmployeeSchema.index({ restaurantId: 1, code: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)("Employee", EmployeeSchema);
