import Knex from 'knex';
// Since we use "module.exports" in knexfile, we need to import that as a JS module
const knexConfig = require('../../knexfile');

export const knex = Knex(knexConfig);

export * from './models';
export * from './instrumentRepo';
export * from './priceRepo';
export * from './rrgRepo';