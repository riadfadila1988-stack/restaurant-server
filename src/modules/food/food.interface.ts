import mongoose, {Document} from "mongoose";

export interface Ingredient {
    materialId: mongoose.Types.ObjectId;
    amount: number;
}

export interface Option extends Document{
    name: string;
    price: number;
    defaultSelected: boolean;
    ingredients: Ingredient[];
    selected?: boolean;

}

export interface Section extends Document {
    title: string;
    multiSelect: boolean; // single choice or multiple choices
    required: boolean;
    options: Option[];
    isPizzaOptions: boolean;
}

export interface Food extends Document{
    restaurantId: mongoose.Types.ObjectId;
    name: string;
    categoryId: mongoose.Types.ObjectId;
    description?: string;
    basePrice: number; // 0 if price is controlled by sections
    available: boolean;
    availableInMenu: boolean;
    ingredients: Ingredient[]; // ✅ direct ingredients for the food
    sections: Section[];       // ✅ sections (sizes, flavors, addons…)
    printers?: mongoose.Types.ObjectId[];
}
