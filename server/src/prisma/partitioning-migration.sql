-- ═══════════════════════════════════════════════════════════════
-- TIMESERIES TABLE PARTITIONING MIGRATION (PostgreSQL 15+)
-- ═══════════════════════════════════════════════════════════════
-- This script converts the "telemetry_logs" table into a range-partitioned 
-- table on the "timestamp" column. Run this during low-traffic maintenance.

BEGIN;

-- 1. Rename the existing B-Tree flat table
ALTER TABLE "telemetry_logs" RENAME TO "telemetry_logs_old";

-- 2. Create the new partitioned parent table
-- NOTE: PostgreSQL requires any PRIMARY KEY or UNIQUE constraints 
-- on a partitioned table to include all partition key columns.
CREATE TABLE "telemetry_logs" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "wordsPerMinute" INTEGER,
    "fillerWordsCount" INTEGER,
    "stressCoefficient" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Composite primary key including the partitioning column
    CONSTRAINT "telemetry_logs_pkey" PRIMARY KEY ("id", "timestamp")
) PARTITION BY RANGE ("timestamp");

-- 3. Create monthly child partition tables
CREATE TABLE "telemetry_logs_y2026m05" PARTITION OF "telemetry_logs"
    FOR VALUES FROM ('2026-05-01 00:00:00') TO ('2026-06-01 00:00:00');

CREATE TABLE "telemetry_logs_y2026m06" PARTITION OF "telemetry_logs"
    FOR VALUES FROM ('2026-06-01 00:00:00') TO ('2026-07-01 00:00:00');

CREATE TABLE "telemetry_logs_y2026m07" PARTITION OF "telemetry_logs"
    FOR VALUES FROM ('2026-07-01 00:00:00') TO ('2026-08-01 00:00:00');

-- Default partition for out-of-range historical/future timestamps
CREATE TABLE "telemetry_logs_default" PARTITION OF "telemetry_logs" DEFAULT;

-- 4. Re-create foreign keys and composite indexes on the parent partitioned table
-- PostgreSQL will automatically propagate these indexes to all child partitions.
ALTER TABLE "telemetry_logs" 
    ADD CONSTRAINT "telemetry_logs_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "interview_sessions" ("id") ON DELETE CASCADE;

CREATE INDEX "telemetry_logs_sessionId_type_timestamp_idx" 
    ON "telemetry_logs" ("sessionId", "type", "timestamp");

-- 5. Migrate existing data from old table into the partitioned parent
-- The database will automatically route rows to the correct monthly partitions.
INSERT INTO "telemetry_logs" (
    "id", 
    "sessionId", 
    "type", 
    "wordsPerMinute", 
    "fillerWordsCount", 
    "stressCoefficient", 
    "timestamp"
)
SELECT 
    "id", 
    "sessionId", 
    "type", 
    "wordsPerMinute", 
    "fillerWordsCount", 
    "stressCoefficient", 
    "timestamp"
FROM "telemetry_logs_old";

-- 6. Drop the old table once data migration is validated
DROP TABLE "telemetry_logs_old";

COMMIT;
