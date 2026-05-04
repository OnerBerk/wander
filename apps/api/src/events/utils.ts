import {QueryFilterDto} from '../filters/dtos/query-filter.dto';

export const getPeriodCondition = (period: QueryFilterDto['period']): string => {
  switch (period) {
    case 'today':
      return 'date_start>=now() AND date_start<now(days=1)';
    case 'week':
      return 'date_start>=now() AND date_start<now(days=7)';
    case 'month':
      return 'date_start>=now() AND date_start<now(months=1)';
    case 'all':
    default:
      return 'date_start>=now()';
  }
};
