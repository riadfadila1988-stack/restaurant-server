import { Router } from "express";
import { getSummary, getTablesSummary, getEmployeesSummary, getTableOrders } from "./analytics.controller";

const router = Router();

router.get("/summary", getSummary);
router.get("/tables-summary", getTablesSummary);
router.get("/employees-summary", getEmployeesSummary);
router.get("/table-orders/:tableId", getTableOrders);

export default router;
