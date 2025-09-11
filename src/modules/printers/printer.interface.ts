import mongoose from 'mongoose';

export interface Printer {
    _id?: string;         // MongoDB ObjectId as string (optional when creating)
    name: string;         // Printer name, e.g. "Kitchen Printer"
    ipAddress?: string;   // Optional network IP address of the printer
    port?: number;        // Optional port number for the printer
    restaurantId: mongoose.Types.ObjectId; // Restaurant owner
    printReceipt?: boolean; // Optional flag to indicate if the printer should print receipts
}
