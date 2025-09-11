import {Response, Request} from "express";
import BaseController from "../../core/base.controller";
import OrderService from "./order.service";
import {
    broadcastLiveTablesUpdate, 
    broadcastOrdersUpdate,
    broadcastOrderCreated,
    broadcastOrderUpdate,
    broadcastTableCleared,
    broadcastOrderMoved
} from "../../utils/sockets";
import {generateReceiptImage} from "../../utils/print";

class OrderController extends BaseController {
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const order = await OrderService.getOrderById(req.params.id, restaurantId);
            if (!order) {
                this.handleError(res, 'Order not found', 404);
                return;
            }
            this.handleSuccess(res, order);
        } catch (e) {
            this.handleError(res, 'Failed to get order',);
        }
    }
    async add(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const newOrder = await OrderService.addNewTableOrder({ ...req.body, restaurantId });
            
            // Broadcast order created event for real-time updates
            broadcastOrderCreated(newOrder);
            
            if (newOrder.type === 'delivery' || newOrder.type === 'takeaway') {
                await broadcastOrdersUpdate(restaurantId);
            }
            await broadcastLiveTablesUpdate(restaurantId);
            this.handleSuccess(res, newOrder);
        } catch (e) {
            console.error(e);
            this.handleError(res, 'Failed to add order',);
        }
    }

    async closeOrderByTableId(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const closed = await OrderService.closeOrderByTableId(req.params.id, restaurantId);
            
            // Broadcast table cleared event for real-time updates
            broadcastTableCleared(req.params.id);
            
            this.handleSuccess(res, closed);
            await broadcastLiveTablesUpdate(restaurantId);
        }catch (e) {
            this.handleError(res, 'Failed to close order',);
        }
    }

    async getOrderByTableId(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const closed = await OrderService.getOrderByTableId(req.params.id, restaurantId);
            this.handleSuccess(res, closed);
        }catch (e) {
            this.handleError(res, 'Failed to close order',);
        }
    }
    async updateOrder(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const updatedOrder = await OrderService.updateOrder(req.params.id, req.body, restaurantId);
            
            // Broadcast order update event for real-time updates
            broadcastOrderUpdate(updatedOrder);
            
            await broadcastLiveTablesUpdate(restaurantId);
            await broadcastOrdersUpdate(restaurantId);
            this.handleSuccess(res, updatedOrder);
        }catch (e) {
            this.handleError(res, 'Failed to update order',);
        }
    }
    async updateOrderItems(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const updatedOrder = await OrderService.updateOrderItems(req.params.id, req.body, restaurantId);
            
            // Broadcast order update event for real-time updates
            broadcastOrderUpdate(updatedOrder);
            
            await broadcastLiveTablesUpdate(restaurantId);
            this.handleSuccess(res, updatedOrder);
        }catch (e) {
            this.handleError(res, 'Failed to update order items',);
        }
    }

    async getOpenedTakeAwayDeliveryOrder(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const order = await OrderService.getOpenedTakeAwayDeliveryOrder(restaurantId);
            this.handleSuccess(res, order);
        }catch (e) {
            this.handleError(res, 'Failed to get order',);
        }
    }

    async getOpenedTableOrders(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const orders = await OrderService.getOpenedTableOrders(restaurantId);
            this.handleSuccess(res, orders);
        } catch (e) {
            this.handleError(res, 'Failed to get table orders');
        }
    }

    async getPersonsInRestaurant(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const persons = await OrderService.getPersonsInRestaurant(restaurantId);
            this.handleSuccess(res, persons);
        } catch (e) {
            this.handleError(res, 'Failed to get persons count');
        }
    }

    async getAllOpenedOrders(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const orders = await OrderService.getOpenedOrders(restaurantId);
            this.handleSuccess(res, orders);
        } catch (e) {
            this.handleError(res, 'Failed to get all opened orders');
        }
    }

    async moveOrderToTable(req: Request, res: Response): Promise<void> {
        try {
            const { orderId, targetTableId } = req.body as { orderId: string, targetTableId: string };
            const restaurantId = (req as any).restaurantId as string;
            
            // Get the original order to find the source table
            const originalOrder = await OrderService.getOrderById(orderId, restaurantId);
            const fromTableId = originalOrder?.tableId?.toString() || '';
            
            const moved = await OrderService.moveOrderToTable(orderId, targetTableId, restaurantId);
            
            // Broadcast order moved event for real-time updates
            broadcastOrderMoved(orderId, fromTableId, targetTableId);
            
            this.handleSuccess(res, moved);
            await broadcastLiveTablesUpdate(restaurantId);
        } catch (e: any) {
            this.handleError(res, e?.message || 'Failed to move order');
        }
    }

    async print(req: Request, res: Response): Promise<void> {
        try {
            const result = await generateReceiptImage();
            this.handleSuccess(res, result);
        }catch (e) {
            this.handleError(res, 'Failed to print order',);
        }
    }

    async cancelOrderItem(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const orderId = req.params.id;
            const { itemId, employeeCode, reason, isCooked } = req.body;
            
            const updatedOrder = await OrderService.cancelOrderItem(
                orderId, 
                itemId, 
                employeeCode, 
                reason, 
                isCooked, 
                restaurantId
            );
            
            // Broadcast order update event for real-time updates
            broadcastOrderUpdate(updatedOrder);
            
            await broadcastLiveTablesUpdate(restaurantId);
            this.handleSuccess(res, updatedOrder);
        } catch (e: any) {
            this.handleError(res, e?.message || 'Failed to cancel order item');
        }
    }

    async markItemsPaid(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const orderId = req.params.id;
            const { itemIds } = req.body; // array of item IDs to mark as paid, or empty array for all items
            
            const updatedOrder = await OrderService.markItemsPaid(orderId, itemIds, restaurantId);
            
            // Broadcast order update event for real-time updates
            broadcastOrderUpdate(updatedOrder);
            
            await broadcastLiveTablesUpdate(restaurantId);
            this.handleSuccess(res, updatedOrder);
        } catch (e: any) {
            this.handleError(res, e?.message || 'Failed to mark items as paid');
        }
    }

    async getCanceledItems(req: Request, res: Response): Promise<void> {
        try {
            const restaurantId = (req as any).restaurantId as string;
            const { startDate, endDate } = req.query;
            const canceledItems = await OrderService.getCanceledItems(
                restaurantId,
                startDate as string,
                endDate as string
            );
            this.handleSuccess(res, canceledItems);
        } catch (e) {
            this.handleError(res, 'Failed to get canceled items');
        }
    }
}

export default new OrderController();