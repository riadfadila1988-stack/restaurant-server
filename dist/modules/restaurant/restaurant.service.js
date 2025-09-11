"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const restaurant_model_1 = require("./restaurant.model");
class RestaurantService {
    async register(name) {
        const apiKey = (0, crypto_1.randomBytes)(24).toString('hex');
        const doc = await restaurant_model_1.RestaurantModel.create({ name, apiKey });
        return doc.toObject();
    }
    async findByApiKey(apiKey) {
        return restaurant_model_1.RestaurantModel.findOne({ apiKey }).lean();
    }
}
exports.default = new RestaurantService();
