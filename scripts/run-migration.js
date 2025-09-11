// Simple script to run the duplicate OrderItem _id migration
// Usage: node scripts/run-migration.js

require('dotenv').config();
const { fixDuplicateOrderItemIds, verifyFix } = require('./fix-duplicate-order-item-ids');

async function runMigration() {
    console.log('🚀 Starting OrderItem _id migration...');
    console.log('Database URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name');
    
    try {
        await fixDuplicateOrderItemIds();
        await verifyFix();
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
