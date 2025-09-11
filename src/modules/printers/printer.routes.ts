import {Router} from "express";
import PrinterController from "./printer.controller";

const router = Router();

router.get('/getAll', async (req, res) => await PrinterController.getAll(req, res));
router.post('/add', async (req, res) => await PrinterController.create(req, res));
router.put('/update/:id', async (req, res) => await PrinterController.update(req, res));
router.delete('/delete/:id', async (req, res) => await PrinterController.delete(req, res));
router.post('/print', async (req, res) => await PrinterController.print(req, res));
export default router;