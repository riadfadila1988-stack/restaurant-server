import { randomBytes } from 'crypto';
import { IRestaurant } from './restaurant.interface';
import { RestaurantModel } from './restaurant.model';

class RestaurantService {
  async register(name: string): Promise<IRestaurant> {
    const apiKey = randomBytes(24).toString('hex');
    const doc = await RestaurantModel.create({ name, apiKey });
    return doc.toObject() as IRestaurant;
  }

  async findByApiKey(apiKey: string): Promise<IRestaurant | null> {
    return RestaurantModel.findOne({ apiKey }).lean();
  }
}

export default new RestaurantService();
