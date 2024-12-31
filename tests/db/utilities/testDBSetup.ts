import { DataType, newDb } from 'pg-mem';
import Knex from 'knex';
import knexConfig from '../../../knexfile';

let knex: Knex.Knex | null = null;

export const initializeTestDb = () => {
  const db = newDb();

  // Register any extensions you need
  db.public.registerFunction({
    name: 'current_database',
    returns: DataType.text,
    implementation: () => 'test_db',
  });

  // Initialize Knex with the in-memory database connection
  knex = Knex({
    ...knexConfig.test,
    client: 'pg',
    connection: db.adapters.createPg().Client,
  });

  // Run migrations
  return knex.migrate.latest();
};

export const getKnex = () => {
  if (!knex) {
    throw new Error('Knex not initialized. Call initializeTestDb first.');
  }
  return knex;
};