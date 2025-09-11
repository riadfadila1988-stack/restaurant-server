import {Router} from "express";
import OrderController from "./order.controller";

const router = Router();

router.post('/add', async (req, res) => await OrderController.add(req, res));
router.put('/closeOrderByTableId/:id', async (req, res) => await OrderController.closeOrderByTableId(req, res));
router.put('/update/:id', async (req, res) => await OrderController.updateOrder(req, res));
router.put('/update-items/:id', async (req, res) => await OrderController.updateOrderItems(req, res));
router.get('/orderByTableId/:id', async (req, res) => await OrderController.getOrderByTableId(req, res));
router.get('/print', async (req, res) => await OrderController.print(req, res));
router.get('/order/:id', async (req, res) => await OrderController.getById(req, res));
router.get('/openedTakeAwayDelivery', async (req, res) => await OrderController.getOpenedTakeAwayDeliveryOrder(req, res));
router.get('/openedTables', async (req, res) => await OrderController.getOpenedTableOrders(req, res));
router.get('/allOpened', async (req, res) => await OrderController.getAllOpenedOrders(req, res));
router.get('/persons', async (req, res) => await OrderController.getPersonsInRestaurant(req, res));
router.post('/moveToTable', async (req, res) => await OrderController.moveOrderToTable(req, res));
router.post('/cancel-item/:id', async (req, res) => await OrderController.cancelOrderItem(req, res));
router.put('/mark-paid/:id', async (req, res) => await OrderController.markItemsPaid(req, res));
router.get('/canceled-items', async (req, res) => await OrderController.getCanceledItems(req, res));

export default router;