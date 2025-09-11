"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_model_1 = __importDefault(require("./categories.model"));
const food_service_1 = __importDefault(require("../food/food.service"));
class CategoriesService {
    async getAllCategories(restaurantId) {
        try {
            return await categories_model_1.default.find({ restaurantId });
        }
        catch (error) {
            console.error("Error getting all categories:", error);
            throw error;
        }
    }
    async getCategoriesFoods(restaurantId) {
        const categories = await this.getAllCategories(restaurantId);
        const categoriesFoods = await Promise.all(categories.map(async (category) => ({
            _id: category._id,
            name: category.name,
            active: category.active,
            restaurantId: category.restaurantId,
            foods: await food_service_1.default.getFoodsByCategoryId(category._id, restaurantId),
        })));
        return categoriesFoods;
    }
    async addNewCategory(category, restaurantId) {
        try {
            return await categories_model_1.default.create({ ...category, restaurantId, _id: undefined });
        }
        catch (error) {
            console.error("Error adding new category:", error);
            throw error;
        }
    }
    async updateCategory(id, updates, restaurantId) {
        try {
            return await categories_model_1.default.findOneAndUpdate({ _id: id, restaurantId }, updates, { new: true });
        }
        catch (error) {
            console.error(`Error updating category with id ${id}:`, error);
            throw error;
        }
    }
    async toggleActiveCategory(id, restaurantId) {
        try {
            const category = await categories_model_1.default.findOne({ _id: id, restaurantId });
            if (!category)
                return null;
            return await categories_model_1.default.findOneAndUpdate({ _id: id, restaurantId }, { active: !category.active }, { new: true });
        }
        catch (error) {
            console.error(`Error toggling active state for category with id ${id}:`, error);
            throw error;
        }
    }
}
exports.default = new CategoriesService();
