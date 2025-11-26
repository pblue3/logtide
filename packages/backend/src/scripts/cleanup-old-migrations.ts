import { db } from '../database/connection.js';
import { sql } from 'kysely';

/**
 * Cleanup script for old migration records after schema consolidation
 *
 * This script removes references to old migration files (002, 003, 004)
 * that were consolidated into 001_initial_schema.sql
 */

async function cleanupOldMigrations() {
  console.log('🧹 Cleaning up old migration records...');

  try {
    // Check if kysely_migration table exists
    const tableExists = await sql<{ exists: boolean }>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'kysely_migration'
      ) as exists
    `.execute(db);

    if (!tableExists.rows[0]?.exists) {
      console.log('✓ kysely_migration table does not exist yet. Nothing to clean.');
      return;
    }

    // Get current migrations
    const currentMigrations = await db
      .selectFrom('kysely_migration')
      .selectAll()
      .execute();

    console.log('Current migrations in database:', currentMigrations.map(m => m.name));

    // Migrations to remove (these were consolidated into 001_initial_schema.sql)
    const obsoleteMigrations = [
      '002_enable_compression',
      '003_add_is_admin_column',
      '004_sigma_notifications'
    ];

    // Delete obsolete migration records
    const result = await db
      .deleteFrom('kysely_migration')
      .where('name', 'in', obsoleteMigrations)
      .executeTakeFirst();

    const deletedCount = Number(result.numDeletedRows || 0);

    if (deletedCount > 0) {
      console.log(`✅ Removed ${deletedCount} obsolete migration record(s)`);
      console.log('   Removed:', obsoleteMigrations.filter(m =>
        currentMigrations.some(cm => cm.name === m)
      ));
    } else {
      console.log('✓ No obsolete migrations found to clean');
    }

    // Show remaining migrations
    const remainingMigrations = await db
      .selectFrom('kysely_migration')
      .selectAll()
      .execute();

    console.log('\nRemaining migrations:', remainingMigrations.map(m => m.name));
    console.log('\n✅ Cleanup complete!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run the cleanup
cleanupOldMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
