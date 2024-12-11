import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const dataProviderUrl = process.env.DATA_PROVIDER_URL;
const apiKey = process.env.API_KEY;

/**
 * This function represents the logic to fetch sector data from a data provider
 * and would eventually store the results in a database.
 */
export async function fetchSectorData(): Promise<void> {
  if (!dataProviderUrl || !apiKey) {
    throw new Error("Missing necessary environment variables (DATA_PROVIDER_URL, API_KEY).");
  }

  // For example: GET request to fetch a list of sector prices
  const response = await axios.get(`${dataProviderUrl}/sectors/prices`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  const sectorsData = response.data;

  // TODO: Validate and normalize data, then store it in DB
  console.log("Fetched sector data: ", sectorsData);
}
