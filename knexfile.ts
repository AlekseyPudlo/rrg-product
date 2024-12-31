import { Knex } from 'knex';
import { config } from './src/config/index';

const knexConfig: { [key: string]:Knex.Config } = {
  test: {
    client: 'pg',
    connection: {},
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
    seeds: {
        directory: './src/db/seeds'
      }
  },
  development: {
    client: 'pg',
    connection: config.databaseUrl,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts'
    },
    // Also specify a seeds directory if plan to seed test data.
    seeds: {
      directory: './src/db/seeds'
    }
  }
}

export default knexConfig;