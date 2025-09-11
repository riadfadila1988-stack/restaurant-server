import BaseController from "../../core/base.controller";
import CategoriesService from "./categories.service";
import {Request, Response} from 'express';
import {Category} from "./ctegories.interfaces";

class CategoriesController extends BaseController{

    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const categories: Category[] = await CategoriesService.getAllCategories(restaurantId);
            this.handleSuccess(res, categories);
        }catch(err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }

    async getCategoriesFoods(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const categories = await CategoriesService.getCategoriesFoods(restaurantId);
            this.handleSuccess(res, categories);
        }catch(err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }

    async addCategory(_req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (_req as any).restaurantId as string;
            const newCategory: Category = await CategoriesService.addNewCategory(_req.body, restaurantId);
            this.handleSuccess(res, newCategory);
        } catch (error) {
            this.handleError(res, 'Failed to add category');
        }
    }

    async updateCategory(_req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (_req as any).restaurantId as string;
            const updatedCategory: Category | null = await CategoriesService.updateCategory(_req.params.id, _req.body, restaurantId);
            this.handleSuccess(res, updatedCategory);
        } catch (error) {
            this.handleError(res, 'Failed to update category');
        }
    }
}

export default new CategoriesController();