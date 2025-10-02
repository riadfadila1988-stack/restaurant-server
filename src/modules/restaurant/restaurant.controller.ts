import { Request, Response } from 'express';
import restaurantService from './restaurant.service';
import BaseController from '../../core/base.controller';

class RestaurantController extends BaseController {
  async register(req: Request, res: Response) {
    try {
      const { name } = req.body || {};
      if (!name) return this.handleError(res, 'Name is required', 400);
      const r = await restaurantService.register(req.body);
      return this.handleSuccess(res, { _id: r._id, name: r.name, apiKey: r.apiKey });
    } catch (e) {
      return this.handleError(res, 'Failed to register restaurant');
    }
  }

  async me(req: Request, res: Response) {
    try {
      const restaurant = (req as any).restaurant || null;
      return this.handleSuccess(res, restaurant);
    } catch (e) {
      return this.handleError(res, 'Failed to load restaurant');
    }
  }
}

export default new RestaurantController();
