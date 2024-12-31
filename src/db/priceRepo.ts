import { knex } from './index';
import { InstrumentPrice } from './models';

/**
 * Repository functions for managing InstrumentPrice records in the database
 */

/**
 * Saves multiple price records in a single batch operation
 * Uses PostgreSQL's upsert functionality to handle duplicate records
 *
 * @param prices - Array of InstrumentPrice objects to save
 * @throws {Error} If the database operation fails
 */
export async function savePrices(prices: InstrumentPrice[]): Promise<void> {
  if (prices.length === 0) return;

  // Transform InstrumentPrice objects into plain DB rows
  const rows = prices.map((price) => ({
    instrument_id: price.instrumentId,
    date: price.date,
    close_price: price.closePrice,
    // add open_price, high_price, volume etc. if needed
  }));

  // Insert all at once. If you need upsert logic:
  await knex('instrument_prices')
    .insert(rows)
    .onConflict(['instrument_id', 'date'])
    .merge(); // merges data if (instrument_id, date) already exists
}

/**
 * Retrieves price records for a specific instrument within a date range
 *
 * @param instrumentId - The unique identifier of the instrument
 * @param startDate - The beginning of the date range (inclusive)
 * @param endDate - The end of the date range (inclusive)
 * @returns Array of InstrumentPrice records sorted by date ascending
 * @throws {Error} If the database query fails
 */
export async function getPricesByInstrumentAndDateRange(
  instrumentId: string,
  startDate: Date,
  endDate: Date
): Promise<InstrumentPrice[]> {
  const records = await knex('instrument_prices')
    .select('*')
    .where('instrument_id', instrumentId)
    .andWhere('date', '>=', startDate)
    .andWhere('date', '<=', endDate)
    .orderBy('date', 'asc');

  // Map DB columns back to InstrumentPrice interface
  return records.map((record) => ({
    id: record.id,
    instrumentId: record.instrument_id,
    date: new Date(record.date),
    closePrice: Number(record.close_price),
  }));
}
