"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restaurant_service_1 = __importDefault(require("./restaurant.service"));
const base_controller_1 = __importDefault(require("../../core/base.controller"));
class RestaurantController extends base_controller_1.default {
    async register(req, res) {
        try {
            const { name } = req.body || {};
            if (!name)
                return this.handleError(res, 'Name is required', 400);
            const r = await restaurant_service_1.default.register(name);
            return this.handleSuccess(res, { _id: r._id, name: r.name, apiKey: r.apiKey });
        }
        catch (e) {
            return this.handleError(res, 'Failed to register restaurant');
        }
    }
    async me(req, res) {
        try {
            const restaurant = req.restaurant || null;
            return this.handleSuccess(res, restaurant);
        }
        catch (e) {
            return this.handleError(res, 'Failed to load restaurant');
        }
    }
}
exports.default = new RestaurantController();
