"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
// src/modules/order/order.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const IngredientSchema = new mongoose_1.Schema({
    materialId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Material", required: true },
    amount: { type: Number, required: true, min: 0 },
}, { _id: false });
const OptionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true }, // original option id
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    defaultSelected: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    ingredients: { type: [IngredientSchema], default: [] },
    slices: { type: [Number], default: [] },
}, { _id: false } // don't create a second _id for the subdoc
);
const SectionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true }, // original section id
    title: { type: String, required: true, trim: true },
    multiSelect: { type: Boolean, required: true },
    required: { type: Boolean, required: true },
    options: { type: [OptionSchema], default: [] },
}, { _id: false });
const OrderItemSchema = new mongoose_1.Schema({
    foodId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    notes: { type: String, default: "" },
    ingredients: { type: [IngredientSchema], default: [] },
    sections: { type: [SectionSchema], default: [] },
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["takeaway", "delivery", "table"], required: true },
    tableId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Table", default: null, required: false },
    tableName: { type: String, default: "", required: false },
    persons: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ["opened", "closed", "canceled"], default: "opened" },
    items: { type: [OrderItemSchema], default: [] }, // ✅ matches client
    totalPrice: { type: Number, required: true, min: 0 },
    employeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employee", required: true },
    restaurantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
}, { timestamps: true });
exports.OrderModel = mongoose_1.default.model("Order", OrderSchema);
