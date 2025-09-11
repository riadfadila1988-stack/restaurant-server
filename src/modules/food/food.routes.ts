import {Router} from "express";
import FoodController from "./food.controller";

const router = Router();

router.post('/add', async (req, res) => await FoodController.addFood(req, res));
router.get('/get-food/:id', async (req, res) => await FoodController.getFoodById(req, res));
router.get('/category/:id', async (req, res) => await FoodController.getFoodsByCategoryId(req, res));
router.put('/update/:id', async (req, res) => await FoodController.updateFood(req, res));
export default router;
