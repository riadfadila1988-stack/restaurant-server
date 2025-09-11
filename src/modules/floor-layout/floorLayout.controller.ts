import {Request, Response} from "express";
import {ILayout} from "./floorLayout.interface";
import floorLayoutService from "./floorLayout.service";
import BaseController from "../../core/base.controller";

class FloorLayoutController extends BaseController {
    async getAllLayouts(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const layouts: ILayout[] = await floorLayoutService.getAllLayouts(restaurantId);
            this.handleSuccess(res, layouts);
        }catch(err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }
    async getCurrentLayout(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const layout: ILayout | null = await floorLayoutService.getCurrentLayout(restaurantId);
            this.handleSuccess(res, layout);
        }catch(err) {
            this.handleError(res, 'Failed to get all categories.');
        }
    }

    async addNewLayout(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const layout = await floorLayoutService.addLayout(req.body as ILayout, restaurantId);
            this.handleSuccess(res, layout);
        }catch(err) {
            this.handleError(res, 'Failed to add new layout');
        }
    }

    async setCurrentLayout(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const layout = await floorLayoutService.updateLayout(req.body as ILayout, restaurantId);
            this.handleSuccess(res, layout);
        }catch(err) {
            this.handleError(res, 'Failed to set current layout');
        }
    }
}

export default new FloorLayoutController();