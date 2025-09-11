"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tableSchema = new mongoose_1.default.Schema({
    name: String,
    shape: { type: String, enum: ['circular', 'square'], default: 'square' },
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    restaurantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
});
exports.default = mongoose_1.default.model('Table', tableSchema);
