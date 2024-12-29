import { knex } from './index';
import { Instrument } from './models';

/**
 * Repository functions for managing Instrument records in the database
 */

/**
 * Creates a new instrument record or updates an existing one if the ID already exists
 * @param instrument - The instrument data to insert/update
 * @throws {Error} If the database operation fails
 */
export async function createOrUpdateInstrument(instrument: Instrument): Promise<void> {
  // Using PostgreSQL's "ON CONFLICT (id) DO UPDATE" approach:
  await knex('instruments')
    .insert({
      id: instrument.id,
      name: instrument.name,
      type: instrument.type
    })
    .onConflict('id')
    .merge(); // or .ignore() if we only want to insert and skip updates
}

/**
 * Retrieves an instrument by its ID
 * @param id - The unique identifier of the instrument to find
 * @returns The matching instrument record, or null if not found
 * @throws {Error} If the database query fails
 */
export async function getInstrumentById(id: string): Promise<Instrument | null> {
  const record = await knex('instruments').where({ id }).first();
  return record || null;
}

/**
 * Retrieves all instruments from the database
 * @returns Array of all instrument records
 * @throws {Error} If the database query fails
 */
export async function getAllInstruments(): Promise<Instrument[]> {
  return knex('instruments').select('*');
}

/**
 * Deletes an instrument record from the database
 * @param id - The unique identifier of the instrument to delete
 * @throws {Error} If the database operation fails
 */
export async function deleteInstrument(id: string): Promise<void> {
  await knex('instruments').where({ id }).del();
}
