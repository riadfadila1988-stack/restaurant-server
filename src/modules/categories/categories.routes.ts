import { Router } from 'express';
import CategoriesController from "./categories.controller";

const router = Router();

router.get('/getAll', async (req, res) => await CategoriesController.getAllCategories(req, res));
router.post('/addCategory', async (req, res) => await CategoriesController.addCategory(req, res));
router.put('/updateCategory/:id', async (req, res) => await CategoriesController.updateCategory(req, res));
router.get('/categoriesFoods', async (req, res) => await CategoriesController.getCategoriesFoods(req, res))
export default router;
