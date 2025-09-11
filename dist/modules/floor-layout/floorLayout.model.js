"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const layoutSchema = new mongoose_1.default.Schema({
    name: String,
    isDefault: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
    restaurantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
    tables: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Table' }],
    walls: [{
            x: { type: Number, required: true },
            y: { type: Number, required: true },
            width: { type: Number, required: true },
            height: { type: Number, required: true },
            orientation: { type: String, enum: ['horizontal', 'vertical'], required: true }
        }],
    decor: [{
            x: { type: Number, required: true },
            y: { type: Number, required: true },
            width: { type: Number, required: true },
            height: { type: Number, required: true },
            type: { type: String, enum: ['library', 'cashier', 'flowers'], required: true }
        }]
});
exports.default = mongoose_1.default.model('Layout', layoutSchema);
