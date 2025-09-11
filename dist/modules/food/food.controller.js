"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base.controller"));
const food_service_1 = __importDefault(require("./food.service"));
class FoodController extends base_controller_1.default {
    async addFood(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const newFood = await food_service_1.default.addNewFood(req.body, restaurantId);
            this.handleSuccess(res, newFood);
        }
        catch (e) {
            this.handleError(res, 'Error adding food');
        }
    }
    async getFoodsByCategoryId(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const foods = await food_service_1.default.getFoodsByCategoryId(req.params.id, restaurantId);
            this.handleSuccess(res, foods);
        }
        catch (e) {
            this.handleError(res, 'Error getting foods');
        }
    }
    async updateFood(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const newFood = await food_service_1.default.updateFood(req.params.id, req.body, restaurantId);
            this.handleSuccess(res, newFood);
        }
        catch (e) {
            this.handleError(res, 'Error updating food');
        }
    }
    async getFoodById(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const food = await food_service_1.default.getFoodById(req.params.id, restaurantId);
            if (!food) {
                this.handleError(res, 'Food not found', 404);
                return;
            }
            this.handleSuccess(res, food);
        }
        catch (e) {
            this.handleError(res, 'Error getting food by ID');
        }
    }
}
exports.default = new FoodController();
