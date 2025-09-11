import {Router} from "express";
import FloorLayoutController from "./floorLayout.controller";

const router = Router();

router.get('/getAll', async (req, res) => await FloorLayoutController.getAllLayouts(req, res));
router.post('/new-layout', async (req, res) => await FloorLayoutController.addNewLayout(req, res));
router.get('/getCurrent', async (req, res) => await FloorLayoutController.getCurrentLayout(req, res));
router.put('/setCurrent/', async (req, res) => await FloorLayoutController.setCurrentLayout(req, res));

export default router;
