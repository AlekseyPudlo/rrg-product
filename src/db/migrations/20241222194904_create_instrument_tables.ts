import type { Knex } from "knex";

const instrumentsTableName = 'instruments';
const pricesTableName = 'instrument_prices';
const rrgPointsTableName = 'rrg_points';


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(instrumentsTableName, (table) => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('type').notNullable(); // 'sector' or 'benchmark'
        // Additional fields as needed
    });

    await knex.schema.createTable(pricesTableName, (table) => {
        table.increments('id').primary();
        table.string('instrument_id').notNullable().references('id').inTable(instrumentsTableName);
        table.date('date').notNullable();
        table.decimal('close_price', 14, 6).notNullable(); // adjust precision as needed
        // Optional fields: open, high, low, volume
        table.unique(['instrument_id', 'date']);
      });
    
      await knex.schema.createTable(rrgPointsTableName, (table) => {
        table.increments('id').primary();
        table.string('instrument_id').notNullable().references('id').inTable(instrumentsTableName);
        table.date('date').notNullable();
        table.decimal('rs_ratio', 10, 6).notNullable();
        table.decimal('rs_momentum', 10, 6).notNullable();
        table.string('quadrant').notNullable(); // 'leading', 'weakening', 'lagging', 'improving'
        table.unique(['instrument_id', 'date']);
      });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(rrgPointsTableName);
    await knex.schema.dropTableIfExists(pricesTableName);
    await knex.schema.dropTableIfExists(instrumentsTableName);
}

