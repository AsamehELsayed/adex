-- SQL script to check and fix duplicate indexes on the users table
-- Run this script in your MySQL client: mysql -u root -p adex_db < scripts/fix-indexes.sql

-- Step 1: Check all indexes on the users table
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS,
    NON_UNIQUE,
    INDEX_TYPE
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
GROUP BY 
    TABLE_NAME, INDEX_NAME, NON_UNIQUE, INDEX_TYPE
ORDER BY 
    INDEX_NAME;

-- Step 2: Count total indexes (should be less than 64)
SELECT 
    COUNT(DISTINCT INDEX_NAME) as total_indexes
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users';

-- Step 3: Find duplicate indexes (indexes on the same columns)
-- This query shows indexes that have the same column combinations
SELECT 
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS,
    GROUP_CONCAT(DISTINCT INDEX_NAME) AS INDEX_NAMES,
    COUNT(DISTINCT INDEX_NAME) AS INDEX_COUNT
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME != 'PRIMARY'
GROUP BY 
    TABLE_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX)
HAVING 
    INDEX_COUNT > 1;

-- Step 4: Remove duplicate indexes manually
-- Replace 'duplicate_index_name' with actual duplicate index names from Step 3
-- Only remove indexes that are NOT the primary key or unique constraints
-- Example:
-- ALTER TABLE users DROP INDEX duplicate_index_name;

-- Common duplicate indexes that might exist:
-- ALTER TABLE users DROP INDEX IF EXISTS username_2;
-- ALTER TABLE users DROP INDEX IF EXISTS username_3;
-- ALTER TABLE users DROP INDEX IF EXISTS email_2;
-- ALTER TABLE users DROP INDEX IF EXISTS email_3;
-- ALTER TABLE users DROP INDEX IF EXISTS users_username_unique;
-- ALTER TABLE users DROP INDEX IF EXISTS users_email_unique;

-- After removing duplicates, verify you still have the necessary indexes:
-- - PRIMARY (on id)
-- - username (unique)
-- - email (unique)

-- Final check: Verify the necessary indexes exist
SELECT 
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS,
    NON_UNIQUE
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
GROUP BY 
    INDEX_NAME, NON_UNIQUE;





