import { Request, Response } from "express";
import analyticsService from "./analytics.service";

export const getSummary = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const summary = await analyticsService.getSummary(from, to);
    res.json(summary);
  } catch (e) {
    console.error("Analytics summary failed", e);
    res.status(500).json({ message: "Failed to get analytics summary" });
  }
};

export const getTablesSummary = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const summary = await analyticsService.getTablesSummary(from, to);
    res.json(summary);
  } catch (e) {
    console.error("Analytics tables summary failed", e);
    res.status(500).json({ message: "Failed to get analytics tables summary" });
  }
};

export const getEmployeesSummary = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const summary = await analyticsService.getEmployeesSummary(from, to);
    res.json(summary);
  } catch (e) {
    console.error("Analytics employees summary failed", e);
    res.status(500).json({ message: "Failed to get analytics employees summary" });
  }
};

export const getTableOrders = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;
    const { from, to } = req.query as { from?: string; to?: string };
    const orders = await analyticsService.getTableOrders(tableId, from, to);
    res.json(orders);
  } catch (e) {
    console.error("Analytics table orders failed", e);
    res.status(500).json({ message: "Failed to get analytics table orders" });
  }
};
