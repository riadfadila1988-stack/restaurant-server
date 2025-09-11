"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const printer_model_1 = __importDefault(require("./printer.model"));
class PrinterService {
    async getAll(restaurantId) {
        try {
            return await printer_model_1.default.find({ restaurantId });
        }
        catch (err) {
            throw err;
        }
    }
    async addNewPrinter(printer, restaurantId) {
        try {
            return await printer_model_1.default.create({ ...printer, restaurantId, _id: undefined });
        }
        catch (err) {
            throw err;
        }
    }
    async updatePrinter(id, printer, restaurantId) {
        try {
            const updatedPrinter = await printer_model_1.default.findOneAndUpdate({ _id: id, restaurantId }, printer, { new: true });
            if (!updatedPrinter) {
                throw new Error('Printer not found');
            }
            return updatedPrinter;
        }
        catch (err) {
            throw err;
        }
    }
    async deletePrinter(id, restaurantId) {
        try {
            const deletedPrinter = await printer_model_1.default.findOneAndDelete({ _id: id, restaurantId });
            if (!deletedPrinter) {
                throw new Error('Printer not found');
            }
        }
        catch (err) {
            throw err;
        }
    }
    async printToDevice(printerId, content, orderId, restaurantId) {
        try {
            const printer = await printer_model_1.default.findOne({ _id: printerId, restaurantId });
            if (!printer) {
                throw new Error('Printer not found');
            }
            // Method 1: Raw TCP Socket Connection (Most Direct)
            const net = require('net');
            const socket = new net.Socket();
            const port = printer.port || 9100; // Default thermal printer port
            return new Promise((resolve, reject) => {
                socket.connect(port, printer.ipAddress, () => {
                    console.log(`Connected to printer: ${printer.name} at ${printer.ipAddress}:${port}`);
                    // ESC/POS commands for thermal printers
                    const escPos = {
                        init: '\x1B\x40', // Initialize printer
                        center: '\x1B\x61\x01', // Center alignment
                        left: '\x1B\x61\x00', // Left alignment
                        bold: '\x1B\x45\x01', // Bold on
                        boldOff: '\x1B\x45\x00', // Bold off
                        cut: '\x1D\x56\x00', // Cut paper
                        newline: '\x0A', // New line
                        feed: '\x1B\x64\x03' // Feed 3 lines
                    };
                    // Format receipt content
                    let receipt = escPos.init;
                    receipt += escPos.center + escPos.bold + 'ORDER RECEIPT' + escPos.boldOff + escPos.newline;
                    receipt += escPos.left + 'Order ID: ' + orderId + escPos.newline;
                    receipt += '------------------------' + escPos.newline;
                    receipt += content + escPos.newline;
                    receipt += '------------------------' + escPos.newline;
                    receipt += escPos.feed + escPos.cut;
                    socket.write(receipt);
                    socket.end();
                });
                socket.on('close', () => {
                    console.log('Printer connection closed');
                    resolve();
                });
                socket.on('error', (err) => {
                    console.error('Printer connection error:', err);
                    reject(err);
                });
                // Timeout after 5 seconds
                socket.setTimeout(5000, () => {
                    socket.destroy();
                    reject(new Error('Printer connection timeout'));
                });
            });
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = new PrinterService();
