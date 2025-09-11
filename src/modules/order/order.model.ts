// src/modules/order/order.model.ts
import mongoose, {Schema} from "mongoose";
import {Option, OrderDocument, OrderItem, CanceledItem, ClientInfo} from "./order.interface";

const IngredientSchema = new Schema(
    {
        materialId: {type: Schema.Types.ObjectId, ref: "Material", required: true},
        amount: {type: Number, required: true, min: 0},
    },
    {_id: false}
);

const OptionSchema = new Schema<Option>(
    {
        _id: {type: Schema.Types.ObjectId, required: true}, // original option id
        name: {type: String, required: true, trim: true},
        price: {type: Number, required: true, min: 0},
        defaultSelected: {type: Boolean, default: false},
        selected: {type: Boolean, default: false},
        ingredients: {type: [IngredientSchema], default: []},
        slices: {type: [Number], default: []},
    },
);

const SectionSchema = new Schema(
    {
        _id: {type: Schema.Types.ObjectId, required: true},
        title: {type: String, required: true, trim: true},
        multiSelect: {type: Boolean, required: true},
        required: {type: Boolean, required: true},
        options: {type: [OptionSchema], default: []},
    },
);


const OrderItemSchema = new Schema<OrderItem>(
    {
        _id: {type: Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId()},
        foodId: {type: Schema.Types.ObjectId, ref: "Food", required: true},
        name: {type: String, required: true, trim: true},
        quantity: {type: Number, required: true, min: 1},
        totalPrice: {type: Number, required: true, min: 0},
        notes: {type: String, default: ""},
        ingredients: {type: [IngredientSchema], default: []},
        sections: {type: [SectionSchema], default: []},
        paid: {type: Boolean, default: false, required: false},
    }
);

const CanceledItemSchema = new Schema<CanceledItem>(
    {
        item: {type: OrderItemSchema, required: true},
        employeeCode: {type: String, required: true, trim: true},
        reason: {type: String, required: true, trim: true},
        isCooked: {type: Boolean, required: true, default: false},
        canceledAt: {type: Date, required: true, default: Date.now},
    },
    {_id: false}
);

const ClientInfoSchema = new Schema<ClientInfo>(
    {
        name: {type: String, trim: true},
        address: {type: String, trim: true},
        phone: {type: String, trim: true},
    },
    {_id: false}
);
const OrderSchema = new Schema<OrderDocument>(
    {
        type: {type: String, enum: ["takeaway", "delivery", "table"], required: true},
        tableId: {type: Schema.Types.ObjectId, ref: "Table", default: null, required: false},
        tableName: {type: String, default: "", required: false},
        persons: {type: Number, default: 1, min: 0},
        status: {type: String, enum: ["opened", "closed", "canceled"], default: "opened"},
        items: {type: [OrderItemSchema], default: []}, // ✅ matches client
        canceledItems: {type: [CanceledItemSchema], default: []},
        totalPrice: {type: Number, required: true, min: 0},
        employeeId: {type: Schema.Types.ObjectId, ref: "Employee", required: true},
        restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant', index: true, required: true},
        client: {type: ClientInfoSchema, default: null},
    },
    {timestamps: true}
);

// Pre-save hook to ensure unique _id values for OrderItems
OrderSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        const seenIds = new Set();
        let hasChanges = false;
        
        for (const item of this.items) {
            // If item doesn't have _id or has duplicate _id, generate new one
            if (!item._id || seenIds.has(item._id.toString())) {
                item._id = new mongoose.Types.ObjectId();
                hasChanges = true;
            }
            seenIds.add(item._id.toString());
        }
        
        if (hasChanges) {
            console.log(`Fixed duplicate/missing _id values for ${this.items.length} items in order ${this._id}`);
        }
    }
    next();
});

// Pre-update hook to ensure unique _id values when updating items
OrderSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate() as any;
    
    // Check if we're pushing new items
    if (update.$push && update.$push.items) {
        const newItems = Array.isArray(update.$push.items) ? update.$push.items : [update.$push.items];
        
        for (const item of newItems) {
            if (!item._id) {
                item._id = new mongoose.Types.ObjectId();
            }
        }
    }
    
    next();
});


export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
