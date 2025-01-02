import { QuadrantType, InstrumentType } from '../types';

/**
 * Domain models.
 * These define the shape of data we store and retrieve.
 */

/**
 * Represents a financial instrument like a sector ETF or benchmark index
 * that we track in the RRG analysis.
 */
export interface Instrument {
  /**
   * Unique identifier for the instrument, typically the ticker symbol
   * @example 'XLK' for Technology Select Sector SPDR Fund
   */
  id: string;

  /**
   * Full name/description of the instrument
   * @example 'Technology Sector SPDR'
   */
  name: string;

  /**
   * Classification of the instrument:
   * - 'sector': A sector ETF or fund that is being analyzed
   * - 'benchmark': The reference index against which sectors are compared
   */
  type: InstrumentType;
}

/**
 * Represents a price record for a financial instrument at a specific date
 */
export interface InstrumentPrice {
  /**
   * Unique identifier for the price record
   * Auto-incremented by the database
   */
  id?: number;

  /**
   * Reference to the instrument this price belongs to
   * Foreign key to Instrument.id
   */
  instrumentId: string;

  /**
   * The date this price was recorded
   */
  date: Date;

  /**
   * The closing price of the instrument on this date
   */
  closePrice: number;

  // Additional fields if needed: openPrice, highPrice, lowPrice, volume
}

/**
 * Represents a point on the Relative Rotation Graph (RRG) for a financial instrument
 * RRG visualizes the relative strength trends of securities compared to a benchmark
 */
export interface RRGPoint {
  /**
   * Unique identifier for the RRG point
   * Auto-incremented by the database
   */
  id?: number;

  /**
   * Reference to the instrument this RRG point belongs to
   * Foreign key to Instrument.id
   */
  instrumentId: string;

  /**
   * The date this RRG point was calculated
   */
  date: Date;

  /**
   * The relative strength ratio compared to the benchmark
   * Values > 100 indicate outperformance vs benchmark
   * Values < 100 indicate underperformance vs benchmark
   */
  rsRatio: number;

  /**
   * The momentum of the relative strength ratio
   * Positive values indicate increasing relative strength
   * Negative values indicate decreasing relative strength
   */
  rsMomentum: number;

  /**
   * The quadrant position on the RRG chart:
   * - leading: Strong relative strength and momentum (top right)
   * - weakening: Strong relative strength but weakening momentum (bottom right)
   * - lagging: Weak relative strength and momentum (bottom left)
   * - improving: Weak relative strength but improving momentum (top left)
   */
  quadrant: QuadrantType;
}
