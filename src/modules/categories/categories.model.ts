import mongoose, { Schema } from "mongoose";
import { Category } from "./ctegories.interfaces";

const CategorySchema: Schema = new Schema<Category>({
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
}, { timestamps: true });

// Ensure category names are unique within a restaurant
CategorySchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export default mongoose.model<Category>('Category', CategorySchema);
