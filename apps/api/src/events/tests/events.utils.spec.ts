import { DateTime } from 'luxon';
import { getDateRangeForPeriod, getPeriodCondition } from '../utils';

describe('events utils', () => {
  describe('getDateRangeForPeriod', () => {
    it('returns today range', () => {
      const { start, end } = getDateRangeForPeriod('today');
      const now = DateTime.now();

      expect(start.toISODate()).toBe(now.startOf('day').toISODate());
      expect(end?.toISODate()).toBe(now.endOf('day').toISODate());
    });

    it('returns week range', () => {
      const { start, end } = getDateRangeForPeriod('week');
      const now = DateTime.now();

      expect(start.toISODate()).toBe(now.startOf('day').toISODate());
      expect(end?.toISODate()).toBe(now.plus({ days: 7 }).endOf('day').toISODate());
    });

    it('returns month range', () => {
      const { start, end } = getDateRangeForPeriod('month');
      const now = DateTime.now();

      expect(start.toISODate()).toBe(now.startOf('day').toISODate());
      expect(end?.toISODate()).toBe(now.plus({ months: 1 }).endOf('day').toISODate());
    });

    it('returns open-ended range for all', () => {
      const { start, end } = getDateRangeForPeriod('all');
      const now = DateTime.now();

      expect(start.toISODate()).toBe(now.startOf('day').toISODate());
      expect(end).toBeNull();
    });

    it('defaults to open-ended range when period is undefined', () => {
      const { end } = getDateRangeForPeriod(undefined);
      expect(end).toBeNull();
    });
  });

  describe('getPeriodCondition', () => {
    it('returns week condition', () => {
      expect(getPeriodCondition('week')).toBe('date_start>=now() AND date_start<now(days=7)');
    });

    it('returns all condition for all period', () => {
      expect(getPeriodCondition('all')).toBe('date_start>=now(days=7)');
    });

    it('defaults to all condition for unknown period', () => {
      expect(getPeriodCondition('today')).toBe('date_start>=now(days=7)');
      expect(getPeriodCondition(undefined)).toBe('date_start>=now(days=7)');
    });
  });
});
