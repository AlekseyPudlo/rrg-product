import { describe, beforeEach, it, expect, vi, beforeAll } from 'vitest';
import { initializeTestDb, getKnex } from './utilities/testDBSetup';
import { 
  Instrument, RRGPoint, InstrumentPrice,
  createOrUpdateInstrument,
  deleteInstrument,
  getAllInstruments,
  getInstrumentById,
  getPricesByInstrumentAndDateRange,
  getRRGPointsByDateRange,
  savePrices,
  saveRRGPoints
} from '../../src/db/index';

describe('Repository Tests', () => {
  // Common test data
  const testDate = new Date('2024-01-01');
  const testInstrument: Instrument = {
    id: 'TEST001',
    name: 'Test Stock',
    type: 'stock'
  };

  const testRRGPoint: RRGPoint = {
    instrumentId: testInstrument.id,
    date: testDate,
    rsRatio: 100,
    rsMomentum: 100,
    quadrant: 'leading'
  };

  const testPrice: InstrumentPrice = {
    instrumentId: testInstrument.id,
    date: testDate,
    closePrice: 100.00
  };

  let knex: ReturnType<typeof getKnex>;

  beforeAll(async () => {
    await initializeTestDb();
    knex = getKnex();
  });

  // Clear relevant tables before each test
  beforeEach(async () => {
    await knex('rrg_points').del();
    await knex('instrument_prices').del();
    await knex('instruments').del();
  });

  describe('instrumentRepo', () => {
    it('should get all instruments', async () => {
      const instruments = [
        testInstrument,
        { ...testInstrument, id: 'TEST002', type: 'benchmark' },
        { ...testInstrument, id: 'TEST003', type: 'sector' }
      ];
      
      await Promise.all(instruments.map(i => createOrUpdateInstrument(i as Instrument)));
      const retrieved = await getAllInstruments();
      
      expect(retrieved).toHaveLength(3);
      expect(retrieved).toEqual(expect.arrayContaining(instruments));
    });

    it('should create and retrieve an instrument', async () => {
      await createOrUpdateInstrument(testInstrument);
      const retrieved = await getInstrumentById(testInstrument.id);
      expect(retrieved).toEqual(testInstrument);
    });

    it('should update existing instrument', async () => {
      await createOrUpdateInstrument(testInstrument);
      const updated = { ...testInstrument, name: 'Updated Name' };
      await createOrUpdateInstrument(updated);
      const retrieved = await getInstrumentById(testInstrument.id);
      expect(retrieved).toEqual(updated);
    });

    it('should return null for non-existent instrument', async () => {
      const retrieved = await getInstrumentById('NONEXISTENT');
      expect(retrieved).toBeNull();
    });

    it('should delete an instrument', async () => {
      await createOrUpdateInstrument(testInstrument);
      await deleteInstrument(testInstrument.id);
      const retrieved = await getInstrumentById(testInstrument.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('rrgRepo', () => {
    beforeEach(async () => {
      // Ensure test instrument exists for foreign key constraint
      await createOrUpdateInstrument(testInstrument);
    });

    it('should save and retrieve RRG points', async () => {
      await saveRRGPoints([testRRGPoint]);
      const retrieved = await getRRGPointsByDateRange(testDate, testDate);
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0]).toMatchObject(testRRGPoint);
    });

    it('should handle empty points array', async () => {
      await expect(saveRRGPoints([])).resolves.not.toThrow();
    });

    it('should handle extreme RS values', async () => {
      const extremePoints = [
        { ...testRRGPoint, rsRatio: Number.MAX_SAFE_INTEGER },
        { ...testRRGPoint, rsMomentum: Number.MAX_SAFE_INTEGER },
        { ...testRRGPoint, rsRatio: -100, rsMomentum: -50, quadrant: 'lagging' as const }
      ];

      for (const point of extremePoints) {
        await saveRRGPoints([point]);
        const retrieved = await getRRGPointsByDateRange(testDate, testDate);
        expect(retrieved[0]).toMatchObject(point);
      }
    });

    it('should return empty array for date range with no data', async () => {
      const futureDate = new Date(testDate.getTime() + 86400000);
      const retrieved = await getRRGPointsByDateRange(futureDate, futureDate);
      expect(retrieved).toHaveLength(0);
    });

    it('should handle all quadrant types', async () => {
      const quadrants = ['leading', 'weakening', 'lagging', 'improving'] as const;
      const quadrantPoints = quadrants.map(q => ({
        ...testRRGPoint,
        date: new Date(testDate.getTime() + Math.random() * 1000),
        quadrant: q
      }));

      await saveRRGPoints(quadrantPoints);
      const retrieved = await getRRGPointsByDateRange(
        new Date(testDate.getTime() - 1000),
        new Date(testDate.getTime() + 1000)
      );

      expect(retrieved).toHaveLength(quadrants.length);
      expect(new Set(retrieved.map(p => p.quadrant))).toEqual(new Set(quadrants));
    });
  });

  describe('priceRepo', () => {
    beforeEach(async () => {
      await createOrUpdateInstrument(testInstrument);
    });

    it('should save and retrieve prices', async () => {
      await savePrices([testPrice]);
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstrument.id,
        testDate,
        testDate
      );
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0]).toMatchObject(testPrice);
    });

    it('should handle empty prices array', async () => {
      await expect(savePrices([])).resolves.not.toThrow();
    });

    it('should handle extreme price values', async () => {
      const extremePrices = [
        { ...testPrice, closePrice: Number.MAX_SAFE_INTEGER },
        { ...testPrice, closePrice: Number.MIN_VALUE }
      ];

      for (const price of extremePrices) {
        await savePrices([price]);
        const retrieved = await getPricesByInstrumentAndDateRange(
          testInstrument.id,
          testDate,
          testDate
        );
        expect(retrieved[0].closePrice).toBe(price.closePrice);
      }
    });

    it('should return empty array for non-existent data', async () => {
      const emptyResults = await Promise.all([
        getPricesByInstrumentAndDateRange('NONEXISTENT', testDate, testDate),
        getPricesByInstrumentAndDateRange(
          testInstrument.id,
          new Date('2025-01-01'),
          new Date('2025-01-01')
        )
      ]);

      emptyResults.forEach(result => expect(result).toHaveLength(0));
    });

    it('should handle multiple prices across dates', async () => {
      const dates = ['2024-01-01', '2024-01-02', '2024-01-03'];
      const prices = dates.map((date, i) => ({
        ...testPrice,
        date: new Date(date),
        closePrice: 100 + i
      }));

      await savePrices(prices);
      const retrieved = await getPricesByInstrumentAndDateRange(
        testInstrument.id,
        new Date(dates[0]),
        new Date(dates[2])
      );

      expect(retrieved).toHaveLength(dates.length);
      expect(retrieved).toEqual(expect.arrayContaining(prices));
    });

    it('should handle prices for multiple instruments', async () => {
      const instruments = [
        testInstrument,
        { ...testInstrument, id: 'TEST002' },
        { ...testInstrument, id: 'TEST003' }
      ];

      await Promise.all(instruments.map(i => createOrUpdateInstrument(i)));

      const prices = instruments.map(i => ({
        ...testPrice,
        instrumentId: i.id
      }));

      await savePrices(prices);

      for (const instrument of instruments) {
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