import {Food} from "../food/food.interface";
import { Types } from "mongoose";

export interface Category {
    _id?: string;
    name: string;
    active: boolean;
    restaurantId: Types.ObjectId;
}

export interface CategoryFoods extends Category {
    foods: Food[];
}