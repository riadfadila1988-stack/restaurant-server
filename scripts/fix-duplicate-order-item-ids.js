// Migration script to fix duplicate _id values in OrderItems
// Run this script to ensure all OrderItems have unique _id values

const mongoose = require('mongoose');
const { Types } = mongoose;

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Fix duplicate _id values in OrderItems
async function fixDuplicateOrderItemIds() {
    try {
        console.log('Starting migration to fix duplicate OrderItem _id values...');
        
        // Find all orders
        const orders = await mongoose.connection.db.collection('orders').find({}).toArray();
        console.log(`Found ${orders.length} orders to process`);
        
        let updatedOrdersCount = 0;
        let totalItemsFixed = 0;
        
        for (const order of orders) {
            if (!order.items || order.items.length === 0) {
                continue;
            }
            
            let hasChanges = false;
            const seenIds = new Set();
            const updatedItems = [];
            
            for (const item of order.items) {
                let itemId = item._id;
                
                // If item doesn't have _id or has duplicate _id, generate new one
                if (!itemId || seenIds.has(itemId.toString())) {
                    itemId = new Types.ObjectId();
                    hasChanges = true;
                    totalItemsFixed++;
                    console.log(`Fixed duplicate/missing _id for item "${item.name}" in order ${order._id}`);
                }
                
                seenIds.add(itemId.toString());
                updatedItems.push({
                    ...item,
                    _id: itemId
                });
            }
            
            // Update the order if there were changes
            if (hasChanges) {
                await mongoose.connection.db.collection('orders').updateOne(
                    { _id: order._id },
                    { $set: { items: updatedItems } }
                );
                updatedOrdersCount++;
                console.log(`Updated order ${order._id} with ${updatedItems.length} items`);
            }
        }
        
        console.log(`Migration completed successfully!`);
        console.log(`- Orders updated: ${updatedOrdersCount}`);
        console.log(`- Items fixed: ${totalItemsFixed}`);
        
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    }
}

// Verify the fix
async function verifyFix() {
    try {
        console.log('\nVerifying the fix...');
        
        const orders = await mongoose.connection.db.collection('orders').find({}).toArray();
        let totalDuplicates = 0;
        let totalItemsChecked = 0;
        
        for (const order of orders) {
            if (!order.items || order.items.length === 0) {
                continue;
            }
            
            const seenIds = new Set();
            for (const item of order.items) {
                totalItemsChecked++;
                if (!item._id) {
                    console.log(`WARNING: Item "${item.name}" in order ${order._id} still has no _id`);
                    totalDuplicates++;
                } else if (seenIds.has(item._id.toString())) {
                    console.log(`WARNING: Duplicate _id found for item "${item.name}" in order ${order._id}`);
                    totalDuplicates++;
                } else {
                    seenIds.add(item._id.toString());
                }
            }
        }
        
        console.log(`Verification completed:`);
        console.log(`- Total items checked: ${totalItemsChecked}`);
        console.log(`- Duplicate/missing _id issues found: ${totalDuplicates}`);
        
        if (totalDuplicates === 0) {
            console.log('✅ All OrderItems now have unique _id values!');
        } else {
            console.log('❌ Some issues still remain. Please run the migration again.');
        }
        
    } catch (error) {
        console.error('Error during verification:', error);
        throw error;
    }
}

// Main execution
async function main() {
    try {
        await connectDB();
        await fixDuplicateOrderItemIds();
        await verifyFix();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the migration
if (require.main === module) {
    main();
}

module.exports = { fixDuplicateOrderItemIds, verifyFix };
