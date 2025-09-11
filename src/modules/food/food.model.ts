import mongoose, { Schema } from "mongoose";
import {Food, Ingredient, Option, Section} from "./food.interface";


const IngredientSchema = new Schema<Ingredient>({
    materialId: { type: Schema.Types.ObjectId, ref: "Material", required: true },
    amount: { type: Number, required: true },
});

const OptionSchema = new Schema<Option>({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    defaultSelected: { type: Boolean, default: false },
    ingredients: [IngredientSchema],
});

const SectionSchema = new Schema<Section>({
    title: { type: String, required: true },
    multiSelect: { type: "boolean",  default: false },
    required: { type: Boolean, default: false },
    options: [OptionSchema],
    isPizzaOptions: { type: Boolean, default: false },
});

const FoodSchema = new Schema<Food>(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        name: { type: String, required: true },
        description: { type: String },
        basePrice: { type: Number, required: true, default: 0 },
        available: { type: Boolean, default: true },
        availableInMenu: { type: Boolean, default: true },
        ingredients: [IngredientSchema], // ✅ simple foods (no options/sections)
        sections: [SectionSchema],       // ✅ configurable foods
        printers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Printer" }],
    },
    { timestamps: true }
);

// Unique food name within a restaurant (optional, can be relaxed later)
FoodSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export default mongoose.model<Food>("Food", FoodSchema);
