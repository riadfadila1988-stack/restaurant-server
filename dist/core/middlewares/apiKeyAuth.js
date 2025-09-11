"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
const restaurant_service_1 = __importDefault(require("../../modules/restaurant/restaurant.service"));
const apiKeyAuth = async (req, res, next) => {
    try {
        const apiKeyHeader = req.headers['x-api-key'];
        const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
        if (!apiKey) {
            res.status(401).json({ message: 'Missing API key' });
            return;
        }
        const restaurant = await restaurant_service_1.default.findByApiKey(apiKey);
        if (!restaurant) {
            res.status(401).json({ message: 'Invalid API key' });
            return;
        }
        req.restaurantId = restaurant._id;
        req.restaurant = restaurant;
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.apiKeyAuth = apiKeyAuth;
