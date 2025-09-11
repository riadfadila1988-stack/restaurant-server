import mongoose from 'mongoose';
import {ILayout} from "./floorLayout.interface";

const layoutSchema = new mongoose.Schema<ILayout>({
    name: String,
    isDefault: {type: Boolean, default: false},
    isCurrent: {type: Boolean, default: false},
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
    tables: [{type: mongoose.Schema.Types.ObjectId, ref: 'Table'}],
    walls: [{
        x: {type: Number, required: true},
        y: {type: Number, required: true},
        width: {type: Number, required: true},
        height: {type: Number, required: true},
        orientation: {type: String, enum: ['horizontal', 'vertical'], required: true}
    }],
    decor: [{
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        type: { type: String, enum: ['library', 'cashier', 'flowers'], required: true },
        rotation: { type: Number, default: 0 }
    }]
});

export default mongoose.model('Layout', layoutSchema);