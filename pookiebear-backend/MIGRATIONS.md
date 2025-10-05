# 🗄️ Database Migrations Guide

## Overview
TypeORM migrations allow version-controlled database schema changes. This ensures all environments (dev, staging, prod) have the same database structure.

## When to Use Migrations

**Use migrations when:**
- Adding/removing columns
- Adding/removing tables
- Changing column types
- Adding indexes or constraints
- Any schema modification

**Don't need migrations for:**
- Data seeding (use separate seed scripts)
- Temporary dev changes (use synchronize in dev)

## Current Setup

- **Development:** `synchronize: true` (auto-updates schema)
- **Production:** `synchronize: false` (migrations required)
- **Migration directory:** `src/migrations/`

## Migration Commands

### Generate Migration (from entity changes)
```bash
npm run migration:generate InitialSchema
```
This creates a migration by comparing entities to current database schema.

### Create Empty Migration (for custom changes)
```bash
npm run migration:create AddUserIndexes
```
Creates an empty migration file for manual SQL.

### Run Migrations
```bash
npm run migration:run
```
Applies all pending migrations.

### Revert Last Migration
```bash
npm run migration:revert
```
Rolls back the most recent migration.

### Show Migration Status
```bash
npm run migration:show
```
Lists all migrations and their status (pending/executed).

### Sync Schema (Dev Only - Dangerous!)
```bash
npm run schema:sync
```
⚠️ Synchronizes schema without migrations. Use only in development!

### Drop All Tables (Dev Only - Very Dangerous!)
```bash
npm run schema:drop
```
⚠️ Drops all database tables. Use only for fresh dev starts!

## Workflow Examples

### Example 1: Add New Column

1. **Update Entity:**
```typescript
// src/entities/User.ts
export class User {
  // ... existing columns
  
  @Column({ nullable: true })
  bio?: string;  // New column
}
```

2. **Generate Migration:**
```bash
npm run migration:generate AddBioToUser
```

3. **Review Generated Migration:**
```typescript
// src/migrations/1234567890-AddBioToUser.ts
export class AddBioToUser1234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    }
}
```

4. **Run Migration:**
```bash
npm run migration:run
```

### Example 2: Add Index

1. **Create Empty Migration:**
```bash
npm run migration:create AddEmailIndex
```

2. **Edit Migration:**
```typescript
// src/migrations/1234567891-AddEmailIndex.ts
export class AddEmailIndex1234567891 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "user" ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_user_email"`);
    }
}
```

3. **Run Migration:**
```bash
npm run migration:run
```

### Example 3: Complex Data Migration

```typescript
export class MigrateDogWeightUnits1234567892 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Convert all weights from kg to lbs
        await queryRunner.query(`
            UPDATE "dog" 
            SET weight = weight * 2.20462 
            WHERE weight IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Convert back to kg
        await queryRunner.query(`
            UPDATE "dog" 
            SET weight = weight / 2.20462 
            WHERE weight IS NOT NULL
        `);
    }
}
```

## Production Deployment Workflow

1. **Develop locally** with `synchronize: true`
2. **Generate migration** before deploying
3. **Commit migration** to git
4. **Deploy to staging:**
   - Run `npm run migration:run`
   - Test thoroughly
5. **Deploy to production:**
   - Run `npm run migration:run`
   - Monitor for errors

## Best Practices

### ✅ Do's
- Always test migrations in staging first
- Keep migrations small and focused
- Write reversible migrations (good `down()` method)
- Commit migrations to version control
- Run migrations before deploying code
- Document complex migrations

### ❌ Don'ts
- Don't edit existing migrations (create new ones)
- Don't use `schema:sync` in production
- Don't skip migration testing
- Don't delete migration files
- Don't mix schema changes with data migrations (split them)

## Troubleshooting

### Migration Already Exists Error
```bash
# Show current migrations
npm run migration:show

# If needed, revert
npm run migration:revert
```

### Schema Out of Sync
```bash
# Generate migration from current diff
npm run migration:generate SyncSchema

# Review carefully before running!
npm run migration:run
```

### Reset Dev Database
```bash
# Nuclear option - fresh start
npm run schema:drop
npm run migration:run
```

## Current Database Schema

As of initial setup, we have:

**Tables:**
- users
- dogs
- activities
- vet_visits
- vaccinations
- medications
- allergies
- feeding_logs
- grooming_logs
- posts
- comments
- likes

**Next Steps:**
1. Generate initial migration (optional - we're using synchronize in dev)
2. Before production: Generate migration from current schema
3. Disable synchronize in production config

## Environment-Specific Behavior

```typescript
// src/config/database.ts
synchronize: process.env.NODE_ENV === 'development'
```

- **Development:** Auto-syncs (no migrations needed)
- **Production:** Migrations required (synchronize is false)

This allows fast iteration in dev while maintaining safety in production.
