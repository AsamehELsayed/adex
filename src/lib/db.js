import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// MySQL database configuration
// Supports both DATABASE_URL and individual connection parameters
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string if provided
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(
    process.env.DB_NAME || 'adex_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: false,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Track if we've already synced to avoid multiple syncs
let hasSynced = false;
let isSyncing = false;

// Test the connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Only sync once to avoid creating duplicate indexes
    // Use sync without alter in production, or only sync on first connection
    if (!hasSynced && !isSyncing) {
      isSyncing = true;
      try {
        // Only use alter in development, and only once
        if (process.env.NODE_ENV === 'development') {
          await sequelize.sync({ alter: false }); // Changed to false to prevent index accumulation
          console.log('✅ Database models synchronized.');
        } else {
          // In production, just verify tables exist, don't alter
          await sequelize.sync({ alter: false });
          console.log('✅ Database connection verified.');
        }
        hasSynced = true;
      } catch (syncError) {
        // If sync fails with index error, log it but don't fail the connection
        if (syncError.message.includes('Too many keys') || syncError.message.includes('64 keys')) {
          console.warn('⚠️  Database sync warning: Too many indexes detected. Please clean up duplicate indexes manually.');
          console.warn('   Run this SQL to check indexes: SHOW INDEXES FROM users;');
          // Continue anyway - tables likely exist
        } else {
          throw syncError;
        }
      } finally {
        isSyncing = false;
      }
    }
    
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;

