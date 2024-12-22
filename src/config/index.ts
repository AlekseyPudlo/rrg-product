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
const DATABASE_URL = getEnvVar('DATABASE_URL');
const MARKET_DATA_PROVIDER = getEnvVar('MARKET_DATA_PROVIDER');
const DATA_PROVIDER_URL = getEnvVar('DATA_PROVIDER_URL');
const API_KEY = getEnvVar('API_KEY');

// Optional variables can have defaults or can be handled more gracefully
const PORT = process.env.PORT || '3000';  // default to 3000 if not specified

export const config = {
    databaseUrl: DATABASE_URL,
    marketDataProvider: MARKET_DATA_PROVIDER.toLowerCase(), // normalize case
    dataProviderUrl: DATA_PROVIDER_URL,
    apiKey: API_KEY,
    port: parseInt(PORT, 10),
  };