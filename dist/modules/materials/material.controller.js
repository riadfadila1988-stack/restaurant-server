"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base.controller"));
const material_service_1 = __importDefault(require("./material.service"));
class MaterialController extends base_controller_1.default {
    async getAll(req, res) {
        try {
            const materials = await material_service_1.default.findAll();
            this.handleSuccess(res, materials);
        }
        catch (e) {
            this.handleError(res, 'Error getting materials');
        }
    }
    async create(req, res) {
        try {
            const material = await material_service_1.default.add(req.body);
            this.handleSuccess(res, material);
        }
        catch (error) {
            this.handleError(res, 'Error adding material');
        }
    }
    async update(req, res) {
        try {
            const material = await material_service_1.default.update(req.params.id, req.body);
            this.handleSuccess(res, material);
        }
        catch (e) {
            this.handleError(res, 'Error updating material');
        }
    }
}
exports.default = new MaterialController();
