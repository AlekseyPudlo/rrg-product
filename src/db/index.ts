import { Sequelize } from 'sequelize';
import { config } from '../config';

// Initialize Sequelize with PostgreSQL dialect
const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false, // Set to console.log to enable SQL query logging
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

export default sequelize;