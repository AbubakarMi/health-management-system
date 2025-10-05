/**
 * Database initialization script
 * Run with: npx tsx scripts/init-db.ts
 */

import dotenv from 'dotenv';
import { testConnection, syncDatabase } from '../src/lib/db';
import { initializeModels } from '../src/models';

// Load environment variables
dotenv.config();

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const connected = await testConnection();

    if (!connected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Initialize models
    console.log('\n📦 Initializing models...');
    await initializeModels();

    // Sync database (creates tables)
    console.log('\n🔄 Synchronizing database schema...');
    await syncDatabase(false); // Set to true to drop and recreate tables

    console.log('\n✅ Database initialization completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
