import cron from 'node-cron';
import { fetchSectorData } from './ingestionWorker';

// Schedule the ingestion job to run daily at midnight UTC
cron.schedule('0 0 * * *', async () => {
  console.log("Starting data ingestion job...");
  try {
    await fetchSectorData();
    console.log("Data ingestion job completed successfully.");
  } catch (err) {
    console.error("Data ingestion job failed: ", err);
  }
});

// Run once at startup for immediate data load (optional)
(async () => {
  try {
    await fetchSectorData();
    console.log("Initial data fetch completed.");
  } catch (err) {
    console.error("Initial data fetch failed: ", err);
  }
})();
