"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base.controller"));
const printer_service_1 = __importDefault(require("./printer.service"));
class PrinterController extends base_controller_1.default {
    async getAll(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const printers = await printer_service_1.default.getAll(restaurantId);
            this.handleSuccess(res, printers);
        }
        catch (err) {
            this.handleError(res, 'Failed to get printers');
        }
    }
    async create(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const printer = await printer_service_1.default.addNewPrinter(req.body, restaurantId);
            this.handleSuccess(res, printer);
        }
        catch (err) {
            this.handleError(res, 'Failed to create Printer');
        }
    }
    async update(req, res) {
        try {
            const restaurantId = req.restaurantId;
            const printer = await printer_service_1.default.updatePrinter(req.params.id, req.body, restaurantId);
            this.handleSuccess(res, printer);
        }
        catch (err) {
            this.handleError(res, 'Failed to update Printer');
        }
    }
    async delete(req, res) {
        try {
            const restaurantId = req.restaurantId;
            await printer_service_1.default.deletePrinter(req.params.id, restaurantId);
            this.handleSuccess(res, { message: 'Printer deleted successfully' });
        }
        catch (err) {
            this.handleError(res, 'Failed to delete Printer');
        }
    }
    async print(req, res) {
        try {
            const { printerId, content, orderId } = req.body;
            const restaurantId = req.restaurantId;
            await printer_service_1.default.printToDevice(printerId, content, orderId, restaurantId);
            this.handleSuccess(res, { message: 'Print job sent successfully' });
        }
        catch (err) {
            this.handleError(res, 'Failed to send print job');
        }
    }
}
exports.default = new PrinterController();
