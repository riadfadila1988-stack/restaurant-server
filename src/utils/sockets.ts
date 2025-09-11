import OrderService from "../modules/order/order.service";
import FloorLayoutService from "../modules/floor-layout/floorLayout.service";
import {io} from "../index";

export async function broadcastOrdersUpdate(restaurantId: string) {
    const order = await OrderService.getOpenedTakeAwayDeliveryOrder(restaurantId);
    io.emit("orders", order);
}

export async function broadcastLiveTablesUpdate(restaurantId: string) {
    console.log(`🔄 Broadcasting live tables update for restaurant: ${restaurantId}`);
    const [tableOrders, persons, allOrders] = await Promise.all([
        OrderService.getOpenedTableOrders(restaurantId),
        OrderService.getPersonsInRestaurant(restaurantId),
        OrderService.getOpenedOrders(restaurantId),
    ]);
    
    console.log(`📊 Broadcasting data:`, {
        tableOrders: tableOrders.length,
        persons,
        allOrders: allOrders.length
    });
    
    io.emit("tableOrders", tableOrders);
    io.emit("persons", persons);
    io.emit("allOrders", allOrders);
    
    console.log(`✅ Socket events emitted successfully`);
}

// New table-specific socket events for real-time table page updates
export async function broadcastTablesUpdate(restaurantId: string, tables?: any[]) {
    console.log(`📋 Broadcasting tables update for restaurant: ${restaurantId}`);
    
    // If tables not provided, fetch from floor plan service
    if (!tables) {
        try {
            const currentLayout = await FloorLayoutService.getCurrentLayout(restaurantId);
            const tablesWithOrders = currentLayout?.tables || [];
            io.emit("tables-updated", tablesWithOrders);
            console.log(`📋 Tables update broadcasted successfully with ${tablesWithOrders.length} tables`);
            return;
        } catch (error) {
            console.error("Failed to fetch tables:", error);
            io.emit("tables-updated", []);
            return;
        }
    }
    
    io.emit("tables-updated", tables);
    console.log(`📋 Tables update broadcasted successfully`);
}

export function broadcastOrderUpdate(order: any) {
    console.log(`📦 Broadcasting order update:`, order._id);
    io.emit("order-updated", order);
}

export function broadcastTableCleared(tableId: string) {
    console.log(`🧹 Broadcasting table cleared:`, tableId);
    io.emit("table-cleared", tableId);
}

export function broadcastOrderCreated(order: any) {
    console.log(`✨ Broadcasting order created:`, order._id);
    io.emit("order-created", order);
}

export function broadcastOrderMoved(orderId: string, fromTableId: string, toTableId: string) {
    console.log(`🚚 Broadcasting order moved:`, { orderId, fromTableId, toTableId });
    io.emit("order-moved", { orderId, fromTableId, toTableId });
}