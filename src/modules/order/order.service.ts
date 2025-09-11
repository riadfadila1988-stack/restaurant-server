import {Types} from "mongoose";
import {Ingredient, NewOrderProps, OrderDocument, OrderItem, Section} from "./order.interface";
import {OrderModel} from "./order.model";
import MaterialService from "../materials/material.service";
import EmployeeService from "../employess/employee.service";
import TableService from "../table/table.service";


class OrderService {
    /**
     * Add a new order to the database
     * @param orderData - order payload (without _id)
     */
    async addNewTableOrder({
                               tableId,
                               persons,
                               employeeCode,
                               type,
                               restaurantId,
                           }: NewOrderProps) {
        const employee = await EmployeeService.getEmployeeByCode(employeeCode, restaurantId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        let newOrder;

        if (type === "table") {
            const table = await TableService.getTableBuId(tableId);
            if (!table) {
                throw new Error("Table not found");
            }

            newOrder = new OrderModel({
                tableId,
                tableName: table.name,
                persons,
                employeeId: employee._id,
                status: "opened",
                type,
                totalPrice: 0,
                items: [],
                restaurantId: new Types.ObjectId(restaurantId),
            });
        } else {
            newOrder = new OrderModel({
                tableId: null,
                tableName: null,
                persons,
                employeeId: employee._id,
                status: "opened",
                type,
                totalPrice: 0,
                items: [],
                restaurantId: new Types.ObjectId(restaurantId),
            });
        }

        const savedOrder = await newOrder.save();
        return savedOrder;
    }

    /**
     * Get take away delivery orders
     */
    async getOpenedTakeAwayDeliveryOrder(restaurantId: string) {
        return OrderModel.find({
            type: {$in: ["takeaway", "delivery"]},
            status: 'opened',
            restaurantId,
        }).populate("employeeId", "name").lean();
    }

    /**
     * Get opened table orders (in-restaurant tables)
     */
    async getOpenedTableOrders(restaurantId: string) {
        return OrderModel.find({
            type: "table",
            status: "opened",
            restaurantId,
        }).populate("employeeId", "name").lean();
    }

    async getOpenedOrders(restaurantId: string) {
        return OrderModel.find({
            status: "opened",
            restaurantId,
        }).populate("employeeId", "name").lean();
    }

    /**
     * Get total persons currently in the restaurant (sum of persons of opened table orders)
     */
    async getPersonsInRestaurant(restaurantId: string) {
        const orders = await OrderModel.find({type: "table", status: "opened", restaurantId}).select("persons").lean();
        return orders.reduce((sum, o: any) => sum + (o.persons || 0), 0);
    }

    /**
     * Get single order by ID
     */
    async getOrderById(orderId: string, restaurantId: string) {
        if (!Types.ObjectId.isValid(orderId)) throw new Error("Invalid Order ID");
        return OrderModel.findOne({_id: orderId, restaurantId}).populate("employeeId", "name").lean();
    }

    async closeOrderByTableId(tableId: string, restaurantId: string) {
        return await OrderModel.findOneAndUpdate({
            tableId,
            status: 'opened',
            restaurantId
        }, {status: 'closed'}, {new: true});
    }

    async getOrderByTableId(tableId: string, restaurantId: string): Promise<OrderDocument> {
        const order = await OrderModel.findOne({tableId, status: 'opened', restaurantId});
        if (!order) {
            throw new Error("Order not found");
        }
        return order
    }

    /**
     * Move an opened order to another table. If destination has an order, merge unpaid items.
     */
    async moveOrderToTable(orderId: string, targetTableId: string, restaurantId: string) {
        if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(targetTableId)) {
            throw new Error("Invalid IDs");
        }

        // Ensure source order exists and is opened
        const sourceOrder = await OrderModel.findOne({_id: orderId, status: 'opened', restaurantId});
        if (!sourceOrder) throw new Error('Order not found or not opened');

        // Ensure destination table exists
        const targetTable = await TableService.getTableBuId(targetTableId);
        if (!targetTable) throw new Error('Destination table not found');

        // Check if destination table has an opened order
        const targetOrder = await OrderModel.findOne({tableId: targetTableId, status: 'opened', restaurantId});

        if (!targetOrder) {
            // No existing order at target table - simple move
            sourceOrder.tableId = new Types.ObjectId(targetTableId) as any;
            sourceOrder.tableName = (targetTable as any).name || '';
            const saved = await sourceOrder.save();
            return saved;
        } else {
            // Target table has an existing order - merge unpaid items
            return await this.mergeOrdersToTable(sourceOrder, targetOrder, restaurantId);
        }
    }

    /**
     * Merge source order's unpaid items into target order, then close source order
     */
    private async mergeOrdersToTable(sourceOrder: OrderDocument, targetOrder: OrderDocument, restaurantId: string) {
        // Get unpaid items from source order
        const unpaidItems = sourceOrder.items.filter(item => !item.paid);

        if (unpaidItems.length === 0) {
            // No unpaid items to move, just close the source order
            sourceOrder.status = 'closed';
            await sourceOrder.save();
            return targetOrder;
        }

        // Collect existing item IDs from target order to avoid duplicates
        const existingIds = new Set<string>();
        targetOrder.items.forEach(item => {
            if (item._id) {
                existingIds.add(item._id.toString());
            }
        });

        // Ensure unpaid items have unique _ids that don't conflict with target order
        const itemsToMove: OrderItem[] = unpaidItems.map(item => {
            let itemId = item._id;

            // If item doesn't have _id or _id already exists in target, generate new one
            if (!itemId || existingIds.has(itemId.toString())) {
                itemId = new Types.ObjectId();
            }

            existingIds.add(itemId.toString());

            return {
                _id: itemId,
                foodId: item.foodId,
                name: item.name,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                paid: false,
                notes: item.notes,
                sections: item.sections,
                ingredients: item.ingredients
            } as OrderItem;
        });

        // Calculate price of items being moved
        const movedItemsPrice = itemsToMove.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

        // Add unpaid items to target order
        targetOrder.items = [...targetOrder.items, ...itemsToMove];
        targetOrder.totalPrice += movedItemsPrice;
        targetOrder.persons += sourceOrder.persons;
        // Update source order: remove unpaid items and recalculate total
        sourceOrder.items = sourceOrder.items.filter(item => item.paid);
        sourceOrder.totalPrice = sourceOrder.items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
        sourceOrder.persons = 0;
        sourceOrder.status = 'closed';

        // Save both orders
        await Promise.all([
            await sourceOrder.save(),
            await targetOrder.save()
        ]);

        return targetOrder;
    }

    async updateOrder(orderId: string, updates: Partial<OrderDocument>, restaurantId: string): Promise<OrderDocument> {
        const order = await OrderModel.findOneAndUpdate({_id: orderId, restaurantId}, updates, {new: true});
        if (!order) {
            throw new Error("Order not found");
        }
        return order.populate("employeeId", "name")
    }

    async updateOrderItems(orderId: string, newItems: OrderItem[], restaurantId: string): Promise<OrderDocument> {
        // First, get the existing order to check for existing item IDs
        const existingOrder = await OrderModel.findOne({_id: orderId, restaurantId});
        if (!existingOrder) {
            throw new Error("Order not found");
        }

        // Collect all existing item IDs
        const existingIds = new Set<string>();
        existingOrder.items?.forEach(item => {
            if (item._id) {
                existingIds.add(item._id.toString());
            }
        });

        // Ensure each new item has a unique _id (unique within new items and against existing items)
        const usedIds = new Set<string>(existingIds);
        const itemsWithIds = newItems.map(item => {
            let itemId = item._id;

            // If item doesn't have _id or _id is already used (in existing items or this batch), generate a new one
            if (!itemId || usedIds.has(itemId.toString())) {
                itemId = new Types.ObjectId();
            }

            usedIds.add(itemId.toString());

            return {
                ...item,
                _id: itemId
            };
        });

        const totalPrice = itemsWithIds.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
        const order = await OrderModel.findOneAndUpdate({_id: orderId, restaurantId}, {
            $push: {items: itemsWithIds},
            $inc: {totalPrice}
        }, {new: true});
        if (!order) {
            throw new Error("Order not found");
        }
        this.consumeIngredients(itemsWithIds);
        return order.populate("employeeId", "name")
    }

    async consumeIngredients(items: OrderItem[]) {
        const ingredientsToConsume = items.flatMap(item => {
            const baseIngredients = item.ingredients ?? [];

            const sectionIngredients = item.sections?.flatMap(section =>
                section.options
                    .filter(opt => opt.selected)
                    .flatMap(opt => opt.ingredients ?? [])
            ) ?? [];

            return [...baseIngredients, ...sectionIngredients];
        });

        await MaterialService.decreaseIngredients(ingredientsToConsume);
    }

    async returnIngredients(items: OrderItem[]) {
        const ingredientsToReturn = items.flatMap(item => {
            const baseIngredients = item.ingredients ?? [];

            const sectionIngredients = item.sections?.flatMap(section =>
                section.options
                    .filter(opt => opt.selected)
                    .flatMap(opt => opt.ingredients ?? [])
            ) ?? [];

            return [...baseIngredients, ...sectionIngredients];
        });

        await MaterialService.increaseIngredients(ingredientsToReturn);
    }

    async cancelOrderItem(
        orderId: string,
        itemId: string,
        employeeCode: string,
        reason: string,
        isCooked: boolean,
        restaurantId: string
    ): Promise<OrderDocument> {
        const order = await OrderModel.findOne({
            _id: new Types.ObjectId(orderId),
            restaurantId: new Types.ObjectId(restaurantId)
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Find item by _id
        const itemIndex = order.items.findIndex(item => item._id?.toString() === itemId);
        if (itemIndex === -1) {
            throw new Error("Item not found");
        }

        // Verify employee exists
        const employee = await EmployeeService.getEmployeeByCode(employeeCode, restaurantId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Get the item to cancel
        const itemToCancel = order.items[itemIndex];

        // If the item was not cooked, return its ingredients to the store
        if (!isCooked) {
            await this.returnIngredients([itemToCancel]);
        }

        // Create canceled item record
        const canceledItem = {
            item: itemToCancel,
            employeeCode,
            reason,
            isCooked,
            canceledAt: new Date()
        };

        // Add to canceled items array
        if (!order.canceledItems) {
            order.canceledItems = [];
        }
        order.canceledItems.push(canceledItem);

        // Remove item from active items
        order.items.splice(itemIndex, 1);

        // Recalculate total price
        order.totalPrice = order.items.reduce((total, item) => {
            return total + (item.totalPrice * item.quantity);
        }, 0);

        // Save the updated order
        await order.save();

        return order;
    }

    async markItemsPaid(
        orderId: string,
        itemIds: string[],
        restaurantId: string
    ): Promise<OrderDocument> {
        const order = await OrderModel.findOne({
            _id: new Types.ObjectId(orderId),
            restaurantId: new Types.ObjectId(restaurantId)
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // If no specific item IDs provided, mark all items as paid
        if (!itemIds || itemIds.length === 0) {
            order.items.forEach(item => {
                item.paid = true;
            });
        } else {
            // Mark specific items as paid by _id
            itemIds.forEach(itemId => {
                const item = order.items.find(item => item._id?.toString() === itemId);
                if (item) {
                    item.paid = true;
                }
            });
        }

        // Save the updated order
        await order.save();

        return order;
    }

    async getCanceledItems(restaurantId: string, startDate: string, endDate: string) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return OrderModel.aggregate([
            {
                $match: {
                    restaurantId: new Types.ObjectId(restaurantId),
                    'canceledItems.0': {$exists: true},
                },
            },
            {
                $unwind: '$canceledItems',
            },
            {
                $match: {
                    'canceledItems.canceledAt': {
                        $gte: start,
                        $lte: end,
                    },
                },
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'canceledItems.employeeCode',
                    foreignField: 'code',
                    as: 'employee',
                },
            },
            {
                $unwind: {
                    path: '$employee',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: '$canceledItems._id',
                    item: '$canceledItems.item',
                    reason: '$canceledItems.reason',
                    isCooked: '$canceledItems.isCooked',
                    canceledAt: '$canceledItems.canceledAt',
                    employeeName: {$ifNull: ['$employee.name', 'N/A']},
                },
            },
        ]);
    }
}

export default new OrderService();
