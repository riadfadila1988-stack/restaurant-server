"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const food_model_1 = __importDefault(require("./food.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class FoodService {
    async getAll(restaurantId) {
        try {
            return await food_model_1.default.find({ restaurantId }).populate('categoryId', 'name');
        }
        catch (error) {
            console.error("Error getting all foods:", error);
            throw error;
        }
    }
    async getFoodById(id, restaurantId) {
        return await food_model_1.default.findOne({ _id: id, restaurantId }).lean();
    }
    async addNewFood(food, restaurantId) {
        return await food_model_1.default.create({ ...food, restaurantId, _id: undefined });
    }
    async getFoodsByCategoryId(categoryId, restaurantId) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
                throw new Error("Invalid category ID format.");
            }
            return await food_model_1.default.find({ categoryId, restaurantId }).populate('categoryId', 'name');
        }
        catch (error) {
            console.error("Error getting foods by category ID:", error);
            throw error;
        }
    }
    async updateFood(id, food, restaurantId) {
        try {
            return await food_model_1.default.findOneAndUpdate({ _id: id, restaurantId }, food, { new: true }).populate('categoryId', 'name');
        }
        catch (error) {
            console.error("Error updating food ID:", id, error);
            throw error;
        }
    }
    async toggleFoodAvailable(id, restaurantId) {
        try {
            const food = await food_model_1.default.findOne({ _id: id, restaurantId });
            if (!food)
                return null;
            return await food_model_1.default.findOneAndUpdate({ _id: id, restaurantId }, { available: !food.available }, { new: true }).populate('categoryId', 'name');
        }
        catch (e) {
            console.error("Error toggling food availability:", e);
            throw e;
        }
    }
    async toggleFoodMenuAvailable(id, restaurantId) {
        try {
            const food = await food_model_1.default.findOne({ _id: id, restaurantId });
            if (!food)
                return null;
            return await food_model_1.default.findOneAndUpdate({ _id: id, restaurantId }, { availableInMenu: !food.availableInMenu }, { new: true }).populate('categoryId', 'name');
        }
        catch (e) {
            console.error("Error toggling food menu availability:", e);
            throw e;
        }
    }
}
exports.default = new FoodService();
