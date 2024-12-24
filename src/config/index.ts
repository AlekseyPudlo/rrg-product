import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// A helper function to ensure a variable is set:
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

// Fetch and validate all required environment variables
const DB_HOST = getEnvVar('DB_HOST');
const DB_PORT = getEnvVar('DB_PORT');
const DB_USER = getEnvVar('DB_USER');
const DB_PASSWORD = getEnvVar('DB_PASSWORD');
const DB_NAME = getEnvVar('DB_NAME');

// Construct the database URL
const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// This variable is used to configure the source of market data for the application.
const MARKET_DATA_PROVIDER = getEnvVar('MARKET_DATA_PROVIDER');
const DATA_PROVIDER_URL = getEnvVar('DATA_PROVIDER_URL');
const API_KEY = getEnvVar('API_KEY');
const PORT = getEnvVar('PORT') || '3000';  // default to 3000 if not specified

export const config = {
    databaseUrl: DATABASE_URL,
    marketDataProvider: MARKET_DATA_PROVIDER.toLowerCase(), // normalize case
    dataProviderUrl: DATA_PROVIDER_URL,
    apiKey: API_KEY,
    port: parseInt(PORT, 10),
  };