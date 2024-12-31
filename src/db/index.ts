import Knex from 'knex';
import knexConfig from '../../knexfile';

//const knexConfig = require('../../knexfile');
const knex = Knex(knexConfig.development);

export default knex;
export * from './models';
export * from './instrumentRepo';
export * from './priceRepo';
export * from './rrgRepo';
