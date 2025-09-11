import BaseController from "../../core/base.controller";
import {Request, Response} from "express";
import MaterialService from "./material.service";

class MaterialController extends BaseController {

    async getAll(req: Request, res: Response) {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const materials = await MaterialService.findAll(restaurantId);
            this.handleSuccess(res, materials);
        }catch (e) {
            this.handleError(res, 'Error getting materials');
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const material = await MaterialService.findOne(req.params.id, restaurantId);
            this.handleSuccess(res, material);
        } catch (e) {
            this.handleError(res, 'Error getting material by ID');
        }
    }

    async create(req: Request, res: Response) {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const material = await MaterialService.add(req.body, restaurantId);
            this.handleSuccess(res, material);
        } catch (error) {
            this.handleError(res, 'Error adding material');
        }
    }

    async update(req: Request, res: Response) {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const material = await MaterialService.update(req.params.id, req.body, restaurantId);
            this.handleSuccess(res, material);
        }catch (e) {
            this.handleError(res, 'Error updating material');
        }
    }
}

export default new MaterialController();
