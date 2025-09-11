import { Types } from 'mongoose';

export interface ITable {
    _id?: Types.ObjectId;
    name: string;
    shape: 'circular' | 'square';
    x: number;
    y: number;
    width: number;
    height: number;
    restaurantId: Types.ObjectId;
    orderId?: boolean;
}