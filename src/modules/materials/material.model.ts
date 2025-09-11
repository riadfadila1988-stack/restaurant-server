import {MaterialDocument} from "./material.interface";
import mongoose, {Schema} from "mongoose";

const MaterialSchema = new Schema<MaterialDocument>({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    unit: { type: String, enum: ["kg", "liter", "unit"], required: true },
    quantity: { type: Number, default: 0 }, // current stock
});

// Unique material name within a restaurant
MaterialSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export const Material = mongoose.model<MaterialDocument>("Material", MaterialSchema);