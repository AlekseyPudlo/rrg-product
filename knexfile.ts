import { Knex } from 'knex';
import { config } from './src/config/index';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: config.databaseUrl,
  migrations: {
    directory: './src/db/migrations',
    extension: 'ts',
    loadExtensions: ['.js', '.ts'],
  },
  seeds: {
    directory: './src/db/seeds'
  }
}

export default knexConfig;