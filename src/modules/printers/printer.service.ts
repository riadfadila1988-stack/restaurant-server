import {Printer} from "./printer.interface";
import PrinterModel from "./printer.model";
import RestaurantService from "../restaurant/restaurant.service";

class PrinterService {
    async getAll(restaurantId: string): Promise<Printer[]> {
        try {
            return await PrinterModel.find({restaurantId});

        } catch (err) {
            throw err;
        }
    }

    async addNewPrinter(printer: Printer, restaurantId: string): Promise<Printer> {
        try {
            return await PrinterModel.create({...printer, restaurantId, _id: undefined})
        } catch (err) {
            throw err;
        }
    }

    async updatePrinter(id: string, printer: Partial<Printer>, restaurantId: string): Promise<Printer> {
        try {
            const updatedPrinter = await PrinterModel.findOneAndUpdate({_id: id, restaurantId}, printer, {new: true});
            if (!updatedPrinter) {
                throw new Error('Printer not found');
            }
            return updatedPrinter;
        } catch (err) {
            throw err;
        }
    }

    async deletePrinter(id: string, restaurantId: string): Promise<void> {
        try {
            const deletedPrinter = await PrinterModel.findOneAndDelete({_id: id, restaurantId});
            if (!deletedPrinter) {
                throw new Error('Printer not found');
            }
        } catch (err) {
            throw err;
        }
    }

    async getReceiptPrinter(restaurantId: string): Promise<{
        serverIp: string,
        serverPort: number,
        receiptPrinterIp: string,
        receiptPrinterPort: number
    }> {
        const receiptPrinter = await PrinterModel.findOne({restaurantId, printReceipt: true});
        const printServer = await RestaurantService.findRestaurantById(restaurantId);
        return {
            serverIp: printServer?.printerServerIp || '',
            serverPort: printServer?.printerServerPort || 0,
            receiptPrinterIp: receiptPrinter?.ipAddress || '',
            receiptPrinterPort: receiptPrinter?.port || 0,
        };
    }
}

export default new PrinterService();