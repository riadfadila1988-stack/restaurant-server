import { Types } from 'mongoose';
import {ITable} from "../table/table.interface";

export interface IWall {
    x: number;
    y: number;
    width: number;
    height: number;
    orientation: 'horizontal' | 'vertical';
}

export type DecorType = 'library' | 'cashier' | 'flowers';

export interface IDecor {
    x: number;
    y: number;
    width: number;
    height: number;
    type: DecorType;
    rotation: number;
}

export interface ILayout {
    _id?: Types.ObjectId;
    name: string;
    isDefault?: boolean;
    isCurrent?: boolean;
    restaurantId: Types.ObjectId;
    tables: Types.ObjectId[] | ITable[];
    walls: IWall[];
    decor?: IDecor[];
}
