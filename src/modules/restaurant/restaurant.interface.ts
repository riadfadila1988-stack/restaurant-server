import { Types } from 'mongoose';

export interface IRestaurant {
  _id?: Types.ObjectId;
  name: string;
  apiKey: string;
  printerServerIp: string;
  printerServerPort: number;
}
