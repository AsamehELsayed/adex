import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'adex_db';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
// Use root for creation if DB_ROOT_PASSWORD is set (typical for setup)
const DB_USER = process.env.DB_ROOT_PASSWORD ? 'root' : (process.env.DB_USER || 'root');
const DB_PASSWORD = process.env.DB_ROOT_PASSWORD || process.env.DB_PASSWORD || '';

async function createDatabase() {
  try {
    console.log('🔄 Creating database...');
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.end();
    console.log(`✅ Database '${DB_NAME}' ready.`);
  } catch (err) {
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Access denied. Try running as MySQL root, or set DB_ROOT_PASSWORD in .env for setup.');
    } else {
      console.error('❌ Error creating database:', err.message);
    }
    process.exit(1);
  }
}

createDatabase();
