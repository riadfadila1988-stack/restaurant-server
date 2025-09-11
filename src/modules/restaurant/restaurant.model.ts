import mongoose, { Schema } from 'mongoose';
import { IRestaurant } from './restaurant.interface';

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true, trim: true },
  apiKey: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

export const RestaurantModel = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
