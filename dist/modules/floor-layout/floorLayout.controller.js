"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const floorLayout_service_1 = __importDefault(require("./floorLayout.service"));
const base_controller_1 = __importDefault(require("../../core/base.controller"));
class FloorLayoutController extends base_controller_1.default {
    async getAllLayouts(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const layouts = await floorLayout_service_1.default.getAllLayouts(restaurantId);
            this.handleSuccess(res, layouts);
        }
        catch (err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }
    async getCurrentLayout(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const layout = await floorLayout_service_1.default.getCurrentLayout(restaurantId);
            this.handleSuccess(res, layout);
        }
        catch (err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }
    async addNewLayout(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const layout = await floorLayout_service_1.default.addLayout(req.body, restaurantId);
            this.handleSuccess(res, layout);
        }
        catch (err) {
            this.handleError(res, 'Failed to add new layout');
        }
    }
    async setCurrentLayout(req, res) {
        try {
            const layoutId = req.params.layoutId;
            const restaurantId = req.restaurantId;
            const layout = await floorLayout_service_1.default.setCurrentLayout(layoutId, restaurantId);
            this.handleSuccess(res, layout);
        }
        catch (err) {
            this.handleError(res, 'Failed to set current layout');
        }
    }
}
exports.default = new FloorLayoutController();
