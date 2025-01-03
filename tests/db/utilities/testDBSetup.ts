import { DataType, newDb } from 'pg-mem';
import type { Knex } from "knex";

let knex: Knex | null = null;;

const knexConfig = {
  client: 'pg',
  //connection: {},
  migrations: {
    directory: './src/db/migrations/test',
    extension: 'ts',
    loadExtensions: ['.js', '.ts'],
  },
  seeds: {
      directory: './src/db/seeds'
    }
}

export const initializeTestDb = () => {
  const memDb = newDb();

  // Register any extensions you need
  memDb.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: () => 'test_db',
  });

  // Initialize Knex with the in-memory database connection
  knex = memDb.adapters.createKnex(undefined, knexConfig) as Knex;
  
  // Run migrations
  return knex!.migrate.latest();
};

export const getKnex = () => {
  if (!knex) {
    throw new Error('Knex not initialized. Call initializeTestDb first.');
  }
  return knex;
};