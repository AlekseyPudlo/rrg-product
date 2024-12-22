import { config } from './config/index';

module.exports = {
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
};
