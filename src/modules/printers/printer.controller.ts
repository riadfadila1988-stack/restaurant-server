import BaseController from "../../core/base.controller";
import {Response, Request} from "express";
import {Printer} from "./printer.interface";
import PrinterService from "./printer.service";

class PrinterController extends BaseController{
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const printers: Printer[] = await PrinterService.getAll(restaurantId);
            this.handleSuccess(res, printers);
        }catch(err) {
            this.handleError(res, 'Failed to get printers');
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const printer: Printer = await PrinterService.addNewPrinter(req.body, restaurantId);
            this.handleSuccess(res, printer);
        }catch(err) {
            this.handleError(res, 'Failed to create Printer');
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const printer: Printer = await PrinterService.updatePrinter(req.params.id, req.body, restaurantId);
            this.handleSuccess(res, printer);
        }catch(err) {
            this.handleError(res, 'Failed to update Printer');
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            await PrinterService.deletePrinter(req.params.id, restaurantId);
            this.handleSuccess(res, { message: 'Printer deleted successfully' });
        }catch(err) {
            this.handleError(res, 'Failed to delete Printer');
        }
    }

    async print(req: Request, res: Response): Promise<void> {
        try {
            const { printerId, content, orderId } = req.body;
            const restaurantId = (req as any).restaurantId as string;
            await PrinterService.printToDevice(printerId, content, orderId, restaurantId);
            this.handleSuccess(res, { message: 'Print job sent successfully' });
        }catch(err) {
            this.handleError(res, 'Failed to send print job');
        }
    }
}

export default new PrinterController();