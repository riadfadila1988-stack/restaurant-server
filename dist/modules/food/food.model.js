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
const mongoose_1 = __importStar(require("mongoose"));
const IngredientSchema = new mongoose_1.Schema({
    materialId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Material", required: true },
    amount: { type: Number, required: true },
});
const OptionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    defaultSelected: { type: Boolean, default: false },
    ingredients: [IngredientSchema],
});
const SectionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    multiSelect: { type: "boolean", default: false },
    required: { type: Boolean, default: false },
    options: [OptionSchema],
    isPizzaOptions: { type: Boolean, default: false },
});
const FoodSchema = new mongoose_1.Schema({
    restaurantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true, default: 0 },
    available: { type: Boolean, default: true },
    availableInMenu: { type: Boolean, default: true },
    ingredients: [IngredientSchema], // ✅ simple foods (no options/sections)
    sections: [SectionSchema], // ✅ configurable foods
    printers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Printer" }],
}, { timestamps: true });
// Unique food name within a restaurant (optional, can be relaxed later)
FoodSchema.index({ restaurantId: 1, name: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Food", FoodSchema);
