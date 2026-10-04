import { DateTime } from 'luxon';

export const formatEventDate = (isoDate: string) => {
  const date = DateTime.fromISO(isoDate).setLocale('fr');

  return {
    day: date.toFormat('ccc').replace('.', ''),
    dayNum: date.toFormat('d'),
    month: date.toFormat('LLL').replace('.', ''),
  };
};
