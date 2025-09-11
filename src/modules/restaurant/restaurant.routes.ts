import { Router } from 'express';
import RestaurantController from './restaurant.controller';
import { apiKeyAuth } from '../../core/middlewares/apiKeyAuth';

const router = Router();

// Public registration endpoint
router.post('/register', (req, res) => RestaurantController.register(req, res));

// Authenticated endpoint to fetch current restaurant by apiKey
router.get('/me', apiKeyAuth, (req, res) => RestaurantController.me(req, res));

export default router;
