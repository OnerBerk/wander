import { DateTime } from 'luxon';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';

export const getDateRangeForPeriod = (period: QueryFilterDto['period']): { start: DateTime; end: DateTime | null } => {
  const now = DateTime.now();
  switch (period) {
    case 'today':
      return { start: now.startOf('day'), end: now.endOf('day') };
    case 'week':
      return { start: now.startOf('day'), end: now.plus({ days: 7 }).endOf('day') };
    case 'month':
      return { start: now.startOf('day'), end: now.plus({ months: 1 }).endOf('day') };
    case 'all':
    default:
      return { start: now.startOf('day'), end: null };
  }
};

export const getPeriodCondition = (period: QueryFilterDto['period']): string => {
  switch (period) {
    case 'week':
      return 'date_start>=now() AND date_start<now(days=7)';
    case 'all':
    default:
      return 'date_start>=now(days=7)';
  }
};
