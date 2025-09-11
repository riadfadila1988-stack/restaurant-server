import { Document, Types } from "mongoose";

export interface MaterialDocument extends Document {
    restaurantId: Types.ObjectId;  // restaurant ownership
    name: string;        // e.g. "Tomato"
    cost: number;        // cost per unit
    unit: "kg" | "liter" | "unit"; // measurement unit
    quantity: number;    // how much you currently have in stock
}