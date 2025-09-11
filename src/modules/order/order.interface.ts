import { Document, Types } from "mongoose";

export type OrderType = "takeaway" | "delivery" | "table";
// Reuse the same shapes your client uses (snapshot stored in order)
export interface Ingredient {
    materialId: Types.ObjectId; // stored as ObjectId in DB
    amount: number;
}

export interface Option {
    _id: Types.ObjectId;        // original option id from Food
    name: string;
    price: number;
    defaultSelected: boolean;
    selected: boolean;          // snapshot of the UI decision
    ingredients: Ingredient[];
    slices: number[];
// ingredients that this option consumes
}

export interface Section {
    _id: Types.ObjectId;        // original section id from Food
    title: string;
    multiSelect: boolean;
    required: boolean;
    options: Option[];
    isPizzaOptions: boolean
}

export interface Printer {
    _id: string;
    name: string;
    ipAddress: string;
    port: number;
    printReceipt: boolean;
}

export interface OrderItem {
    _id: Types.ObjectId;        // unique identifier for this order item
    foodId: Types.ObjectId;     // reference to Food
    name: string;               // snapshot of food name
    quantity: number;
    totalPrice: number;         // per-item total (incl. selected options) * quantity
    notes?: string;
    ingredients: Ingredient[];  // base food ingredients snapshot
    sections: Section[];
    paid?: boolean;             // whether this item has been paid for
}

export interface CanceledItem {
    item: OrderItem;
    employeeCode: string;
    reason: string;
    isCooked: boolean;
    canceledAt: Date;
}

export interface ClientInfo {
    name?: string;
    address?: string;
    phone?: string;
}

export interface OrderDocument extends Document {
    type: OrderType;
    tableId?: Types.ObjectId | null;
    tableName?: string;
    status: "opened" | "closed" | "canceled";
    items: OrderItem[];         // ✅ matches client payload
    canceledItems?: CanceledItem[];
    totalPrice: number;         // order grand total
    createdAt: Date;
    updatedAt: Date;
    persons: number;
    employeeId?: Types.ObjectId | null;
    restaurantId: Types.ObjectId;
    client?: ClientInfo;
}

export interface NewOrderProps {
    tableId: string;
    persons: number;
    employeeCode: string;
    type: OrderType;
    restaurantId: string;
}