import {Router} from "express";
import EmployeeController from "./employee.controller";
import {Request, Response} from "express";
const router = Router();

router.get('/getAll', async (req: Request, res: Response) => await EmployeeController.getAll(req, res));
router.post('/add', async (req: Request, res: Response) => await EmployeeController.create(req, res));

export default router;