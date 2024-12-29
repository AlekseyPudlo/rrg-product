import { describe, beforeEach, it, expect } from 'vitest';
import { knex } from '../../src/db/index';
import { createOrUpdateInstrument, getInstrumentById, getAllInstruments, deleteInstrument } from '../../src/db/index';
import { saveRRGPoints, getRRGPointsByDateRange } from '../../src/db/index';
import { savePrices, getPricesByInstrumentAndDateRange } from '../../src/db/index';
import { Instrument, RRGPoint, InstrumentPrice } from '../../src/db/index';

describe('Repository Tests', () => {
  // Test data
  const testDate = new Date('2024-01-01');
  const testInstruments: Instrument[] = [
    {
      id: 'TEST001',
      name: 'Test Stock',
      type: 'stock'
    },
    {
      id: 'TEST002', 
      name: 'Test Benchmark',
      type: 'benchmark'
    },
    {
      id: 'TEST003',
      name: 'Test Sector',
      type: 'sector'
    }
  ];

  const testRRGPoints: RRGPoint[] = [{
    id: 1,
    instrumentId: testInstruments[0].id,
    date: testDate,
    rsRatio: 100,
    rsMomentum: 100,
    quadrant: 'leading'
  }];

  const testPrices: InstrumentPrice[] = [{
    id: 1,
    instrumentId: testInstruments[0].id,
    date: testDate,
    closePrice: 100.00
  }];

  // Clear relevant tables before each test
  beforeEach(async () => {
    await knex('rrg_points').del();
    await knex('instrument_prices').del();
    await knex('instruments').del();
  });

  describe('instrumentRepo', () => {
    it('should get all instruments', async () => {
      await Promise.all(testInstruments.map(i => createOrUpdateInstrument(i)));
      
      const retrieved = await getAllInstruments();
      
      expect(retrieved).toHaveLength(3);
      expect(retrieved).toEqual(expect.arrayContaining(testInstruments));
    });

    it('should create and retrieve an instrument', async () => {
      await createOrUpdateInstrument(testInstruments[0]);
      const retrieved = await getInstrumentById(testInstruments[0].id);
      expect(retrieved).toEqual(testInstruments[0]);
    });

    it('should update existing instrument', async () => {
      await createOrUpdateInstrument(testInstruments[0]);
      const updated = { ...testInstruments[0], name: 'Updated Name' };
      await createOrUpdateInstrument(updated);
      const retrieved = await getInstrumentById(testInstruments[0].id);
      expect(retrieved).toEqual(updated);
    });

    it('should return null for non-existent instrument', async () => {
      const retrieved = await getInstrumentById('NONEXISTENT');
      expect(retrieved).toBeNull();
    });

    it('should delete an instrument', async () => {
      await createOrUpdateInstrument(testInstruments[0]);
      await deleteInstrument(testInstruments[0].id);
      const retrieved = await getInstrumentById(testInstruments[0].id);
      expect(retrieved).toBeNull();
    });
  });

  describe('rrgRepo', () => {
    it('should save and retrieve RRG points', async () => {
      await saveRRGPoints(testRRGPoints);
      const retrieved = await getRRGPointsByDateRange(
        testDate,
        testDate
      );
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0]).toMatchObject(testRRGPoints[0]);
    });

    it('should handle empty points array', async () => {
      await expect(saveRRGPoints([])).resolves.not.toThrow();
    });
  });

  describe('priceRepo', () => {
    it('should save and retrieve prices', async () => {
      await savePrices(testPrices);
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstruments[0].id,
        testDate,
        testDate
      );
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0]).toMatchObject(testPrices[0]);
    });

    it('should handle empty prices array', async () => {
      await expect(savePrices([])).resolves.not.toThrow();
    });

    it('should handle extremely large price values', async () => {
      const largePrice: InstrumentPrice = {
        instrumentId: testInstruments[0].id,
        date: testDate,
        closePrice: Number.MAX_SAFE_INTEGER
      };
      await savePrices([largePrice]);
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstruments[0].id,
        testDate,
        testDate
      );
      expect(retrieved[0].closePrice).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle very small positive price values', async () => {
      const smallPrice: InstrumentPrice = {
        instrumentId: testInstruments[0].id,
        date: testDate,
        closePrice: Number.MIN_VALUE
      };
      await savePrices([smallPrice]);
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstruments[0].id,
        testDate,
        testDate
      );
      expect(retrieved[0].closePrice).toBe(Number.MIN_VALUE);
    });

    it('should return empty array for non-existent instrument', async () => {
      const retrieved = await getPricesByInstrumentAndDateRange(
        'NONEXISTENT',
        testDate,
        testDate
      );
      expect(retrieved).toHaveLength(0);
    });

    it('should return empty array for date range with no data', async () => {
      await savePrices(testPrices);
      const futureDate = new Date('2025-01-01');
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstruments[0].id,
        futureDate,
        futureDate
      );
      expect(retrieved).toHaveLength(0);
    });

    it('should handle multiple prices for same instrument on different dates', async () => {
      const multiplePrices: InstrumentPrice[] = [
        {
          instrumentId: testInstruments[0].id,
          date: new Date('2024-01-01'),
          closePrice: 100.00
        },
        {
          instrumentId: testInstruments[0].id,
          date: new Date('2024-01-02'),
          closePrice: 101.00
        },
        {
          instrumentId: testInstruments[0].id,
          date: new Date('2024-01-03'),
          closePrice: 102.00
        }
      ];
      await savePrices(multiplePrices);
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstruments[0].id,
        new Date('2024-01-01'),
        new Date('2024-01-03')
      );
      expect(retrieved).toHaveLength(3);
      expect(retrieved).toEqual(expect.arrayContaining(multiplePrices));
    });

    it('should handle prices for multiple instruments on same date', async () => {
      const multiInstrumentPrices: InstrumentPrice[] = testInstruments.map(instrument => ({
        instrumentId: instrument.id,
        date: testDate,
        closePrice: 100.00
      }));
      await savePrices(multiInstrumentPrices);
      
      for (const instrument of testInstruments) {
        const retrieved = await getPricesByInstrumentAndDateRange(
          instrument.id,
          testDate,
          testDate
        );
        expect(retrieved).toHaveLength(1);
        expect(retrieved[0].instrumentId).toBe(instrument.id);
      }
    });
  });
});