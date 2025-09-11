import mongoose, { Schema } from 'mongoose';
import {Printer} from "./printer.interface";

const PrinterSchema = new Schema<Printer>({
    name: { type: String, required: true },
    ipAddress: { type: String }, // if network printer, optional
    port: { type: Number }, // optional port number
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
    printReceipt: { type: Boolean, default: false },
}, { timestamps: true });

// Unique printer name within a restaurant
PrinterSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

export default mongoose.model('Printer', PrinterSchema);
