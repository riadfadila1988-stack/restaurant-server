import { randomBytes } from 'crypto';
import { IRestaurant } from './restaurant.interface';
import { RestaurantModel } from './restaurant.model';

class RestaurantService {
  async register(restaurant: Omit<IRestaurant, 'apiKey'>): Promise<IRestaurant> {
    const apiKey = randomBytes(24).toString('hex');
    const doc = await RestaurantModel.create({ ...restaurant, apiKey });
    return doc.toObject() as IRestaurant;
  }

  async findByApiKey(apiKey: string): Promise<IRestaurant | null> {
    return RestaurantModel.findOne({ apiKey }).lean();
  }

  async findRestaurantById(id: string): Promise<IRestaurant | null> {
    return RestaurantModel.findById(id).lean();
  }

}

export default new RestaurantService();
