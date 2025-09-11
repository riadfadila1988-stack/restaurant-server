import {Document, Types} from "mongoose";

export interface Employee extends Document {
    name: string;
    code: string;
    active: boolean;
    restaurantId: Types.ObjectId;
}