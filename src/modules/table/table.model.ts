import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    name: String,
    shape: { type: String, enum: ['circular', 'square'], default: 'square' },
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true },
});

export default mongoose.model('Table', tableSchema);