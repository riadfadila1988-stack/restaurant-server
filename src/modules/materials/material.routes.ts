import {Router} from "express";
import MaterialController from "./material.controller";

const router = Router();

router.get('/getAll', async (req, res) => MaterialController.getAll(req, res));
router.get('/get/:id', async (req, res) => MaterialController.getById(req, res));
router.post('/add', async (req, res) => await MaterialController.create(req, res));
router.put('/update/:id', async (req, res) => await MaterialController.update(req, res));

export default router;