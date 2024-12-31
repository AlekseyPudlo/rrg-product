import knex from './index';
import { RRGPoint } from './models';

/**
 * Repository functions for managing RRG (Relative Rotation Graph) points in the database
 */

/**
 * Saves multiple RRG point records in a single batch operation
 * Uses PostgreSQL's upsert functionality to handle duplicate records
 *
 * @param points - Array of RRGPoint objects to save
 * @throws {Error} If the database operation fails
 */
export async function saveRRGPoints(points: RRGPoint[]): Promise<void> {
  if (points.length === 0) return;

  const rows = points.map((point) => ({
    instrument_id: point.instrumentId,
    date: point.date,
    rs_ratio: point.rsRatio,
    rs_momentum: point.rsMomentum,
    quadrant: point.quadrant,
  }));

  await knex('rrg_points')
    .insert(rows)
    .onConflict(['instrument_id', 'date'])
    .merge();
}

/**
 * Retrieves RRG point records within a specified date range
 *
 * @param startDate - The beginning of the date range (inclusive)
 * @param endDate - The end of the date range (inclusive)
 * @returns Array of RRGPoint records sorted by date ascending
 * @throws {Error} If the database query fails
 */
export async function getRRGPointsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<RRGPoint[]> {
  const records = await knex('rrg_points')
    .select('*')
    .where('date', '>=', startDate)
    .andWhere('date', '<=', endDate)
    .orderBy('date', 'asc');

  return records.map((rec) => ({
    id: rec.id,
    instrumentId: rec.instrument_id,
    date: new Date(rec.date),
    rsRatio: Number(rec.rs_ratio),
    rsMomentum: Number(rec.rs_momentum),
    quadrant: rec.quadrant,
  }));
}
