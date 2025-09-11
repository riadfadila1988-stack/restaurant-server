import CategorySchema from "./categories.model";
import {Category, CategoryFoods} from "./ctegories.interfaces";
import FoodService from "../food/food.service";

class CategoriesService {
    async getAllCategories(restaurantId: string): Promise<Category[]> {
        try {
            return await CategorySchema.find({ restaurantId });
        } catch (error) {
            console.error("Error getting all categories:", error);
            throw error;
        }
    }

    async getCategoriesFoods(restaurantId: string): Promise<CategoryFoods[]> {
        const categories: Category[] = await this.getAllCategories(restaurantId);
        const categoriesFoods= await Promise.all(categories.map(async category => ({
            _id: category._id,
            name: category.name,
            active: category.active,
            restaurantId: category.restaurantId,
            foods: await FoodService.getFoodsByCategoryId(category._id as string, restaurantId),
        })));
        return categoriesFoods;
    }

    async addNewCategory(category: Category, restaurantId: string): Promise<Category> {
        try {
            return await CategorySchema.create({ ...category, restaurantId, _id: undefined });
        } catch (error) {
            console.error("Error adding new category:", error);
            throw error;
        }
    }

    async updateCategory(id: string, updates: Partial<Category>, restaurantId: string): Promise<Category | null> {
        try {
            return await CategorySchema.findOneAndUpdate({ _id: id, restaurantId }, updates, { new: true });
        } catch (error) {
            console.error(`Error updating category with id ${id}:`, error);
            throw error;
        }
    }

    async toggleActiveCategory(id: string, restaurantId: string): Promise<Category | null> {
        try {
            const category = await CategorySchema.findOne({ _id: id, restaurantId });
            if (!category) return null;

            return await CategorySchema.findOneAndUpdate(
                { _id: id, restaurantId },
                { active: !category.active },
                { new: true }
            );
        } catch (error) {
            console.error(`Error toggling active state for category with id ${id}:`, error);
            throw error;
        }
    }
}

export default new CategoriesService();
