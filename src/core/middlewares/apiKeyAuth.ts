import { Request, Response, NextFunction } from 'express';
import restaurantService from '../../modules/restaurant/restaurant.service';

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKeyHeader = req.headers['x-api-key'];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
    if (!apiKey) {
      res.status(401).json({ message: 'Missing API key' });
      return;
    }
    const restaurant = await restaurantService.findByApiKey(apiKey);
    if (!restaurant) {
      res.status(401).json({ message: 'Invalid API key' });
      return;
    }
    (req as any).restaurantId = restaurant._id;
    (req as any).restaurant = restaurant;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
