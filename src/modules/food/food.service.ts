import {Food} from "./food.interface";
import FoodSchema from "./food.model";
import mongoose, {Types} from "mongoose";

class FoodService {
    async getAll(restaurantId: string): Promise<Food[]> {
        try {
            return await FoodSchema.find({ restaurantId }).populate('categoryId', 'name');
        } catch (error) {
            console.error("Error getting all foods:", error);
            throw error;
        }
    }

    async getFoodById(id: string | Types.ObjectId, restaurantId: string): Promise<Food | null> {
        return await FoodSchema.findOne({ _id: id, restaurantId }).lean();
    }

    async addNewFood(food: Food, restaurantId: string): Promise<Food> {
        return  await FoodSchema.create({
            ...food,
            restaurantId,
            _id: undefined,
            sections: food.sections.map(s=>({
                ...s,
                _id: undefined,
                options: s.options.map(o=>({
                    ...o,
                    _id: undefined,
                }))
            })) });
    }

    async getFoodsByCategoryId(categoryId: string, restaurantId: string): Promise<Food[]> {
        try {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                throw new Error("Invalid category ID format.");
            }

            return await FoodSchema.find({ categoryId, restaurantId }).populate('categoryId', 'name').populate('printers', ['ipAddress', 'port']);
        } catch (error) {
            console.error("Error getting foods by category ID:", error);
            throw error;
        }
    }

    async updateFood(id: string, food: Food, restaurantId: string): Promise<Food | null> {
        try {
            return await FoodSchema.findOneAndUpdate({ _id: id, restaurantId }, {
                ...food,
                restaurantId,
                _id: undefined,
                sections: food?.sections.map(s=>({
                    ...s,
                    _id: undefined,
                    options: s.options.map(o=>({
                        ...o,
                        _id: undefined,
                    }))
                })) } , {new: true}).populate('categoryId', 'name');
        } catch (error) {
            console.error("Error updating food ID:", id, error);
            throw error;
        }
    }

    async toggleFoodAvailable(id: string, restaurantId: string): Promise<Food | null> {
        try {
            const food = await FoodSchema.findOne({ _id: id, restaurantId });
            if (!food) return null;

            return await FoodSchema.findOneAndUpdate(
                { _id: id, restaurantId },
                {available: !food.available},
                {new: true}
            ).populate('categoryId', 'name');
        } catch (e) {
            console.error("Error toggling food availability:", e);
            throw e;
        }
    }

    async toggleFoodMenuAvailable(id: string, restaurantId: string): Promise<Food | null> {
        try {
            const food = await FoodSchema.findOne({ _id: id, restaurantId });
            if (!food) return null;

            return await FoodSchema.findOneAndUpdate(
                { _id: id, restaurantId },
                {availableInMenu: !food.availableInMenu},
                {new: true}
            ).populate('categoryId', 'name');
        } catch (e) {
            console.error("Error toggling food menu availability:", e);
            throw e;
        }
    }
}

export default new FoodService();
