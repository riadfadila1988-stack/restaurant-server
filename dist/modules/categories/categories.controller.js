"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base.controller"));
const categories_service_1 = __importDefault(require("./categories.service"));
class CategoriesController extends base_controller_1.default {
    async getAllCategories(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const categories = await categories_service_1.default.getAllCategories(restaurantId);
            this.handleSuccess(res, categories);
        }
        catch (err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }
    async getCategoriesFoods(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const categories = await categories_service_1.default.getCategoriesFoods(restaurantId);
            this.handleSuccess(res, categories);
        }
        catch (err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }
    async addCategory(_req, res) {
        try {
            const restaurantId = _req.restaurantId;
            const newCategory = await categories_service_1.default.addNewCategory(_req.body, restaurantId);
            this.handleSuccess(res, newCategory);
        }
        catch (error) {
            this.handleError(res, 'Failed to add category');
        }
    }
    async updateCategory(_req, res) {
        try {
            const restaurantId = _req.restaurantId;
            const updatedCategory = await categories_service_1.default.updateCategory(_req.params.id, _req.body, restaurantId);
            this.handleSuccess(res, updatedCategory);
        }
        catch (error) {
            this.handleError(res, 'Failed to update category');
        }
    }
}
exports.default = new CategoriesController();
