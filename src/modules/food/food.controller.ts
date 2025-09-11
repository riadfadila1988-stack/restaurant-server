import BaseController from "../../core/base.controller";
import {Request, Response} from 'express';
import FoodService from "./food.service";

class FoodController extends BaseController {
    async addFood(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const newFood = await FoodService.addNewFood(req.body, restaurantId);
            this.handleSuccess(res, newFood);
        } catch (e) {
            console.error(e);
            this.handleError(res, 'Error adding food');
        }
    }

    async getFoodsByCategoryId(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const foods = await FoodService.getFoodsByCategoryId(req.params.id, restaurantId);
            this.handleSuccess(res, foods);
        } catch (e) {
            this.handleError(res, 'Error getting foods');
        }
    }

    async updateFood(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const newFood = await FoodService.updateFood(req.params.id, req.body, restaurantId);
            this.handleSuccess(res, newFood);
        } catch (e) {
            this.handleError(res, 'Error updating food');
        }
    }

    async getFoodById(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const food = await FoodService.getFoodById(req.params.id, restaurantId);
            if (!food) {
                this.handleError(res, 'Food not found', 404);
                return;
            }
            this.handleSuccess(res, food);
        } catch (e) {
            this.handleError(res, 'Error getting food by ID');
        }
    }
}

export default new FoodController();