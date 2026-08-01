import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const BUSINESS_TIMEZONE = "Pacific/Port_Moresby";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(localizedFormat);

export const buildBusinessDate = (year: number, month: number, day: number): Date => {
  return dayjs()
    .tz(BUSINESS_TIMEZONE)
    .year(year)
    .month(month - 1)
    .date(day)
    .utc()
    .toDate();
};

export const businessDateDiff = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): number => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE).startOf("day");
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date2.diff(_date1, "day");
};

export const businessDateIsSame = (
  date1: dayjs.ConfigType,
  date2?: dayjs.ConfigType,
  unit: dayjs.OpUnitType = "day",
): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE).startOf("day");
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date2.isSame(_date1, unit);
};

export const businessDateIsBefore = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE).startOf("day");
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date2.isBefore(_date1, "day");
};

export const businessDateIsSameOrBefore = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE).startOf("day");
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date2.isSameOrBefore(_date1, "day");
};

export const businessDateIsAfter = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE).startOf("day");
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date2.isAfter(_date1, "day");
};

export const businessDateIsSameOrAfter = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE).startOf("day");
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date2.isSameOrAfter(_date1, "day");
};

export const businessDateAdd = (amount: number, date?: dayjs.ConfigType, unit: dayjs.ManipulateType = "days"): Date => {
  const _date = dayjs(date).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date.add(amount, unit).utc().toDate();
};

export const businessDateSubtract = (amount: number, date?: dayjs.ConfigType, unit: dayjs.ManipulateType = "days"): Date => {
  const _date = dayjs(date).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date.subtract(amount, unit).utc().toDate();
};

export const businessDate = (date?: dayjs.ConfigType): Date => {
  const _date = dayjs(date).tz(BUSINESS_TIMEZONE).startOf("day");
  return _date.utc().toDate();
};

export const businessDateRange = (date?: dayjs.ConfigType): { start: Date; end: Date } => {
  const _date = dayjs(date).tz(BUSINESS_TIMEZONE).startOf("day");
  return {
    start: _date.toDate(),
    end: _date.endOf("day").toDate(),
  };
};

export const formatBusinessDate = (date?: dayjs.ConfigType, format: string = "LL"): string => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).format(format);
};

export const businessTimestampDiff = (
  date1: dayjs.ConfigType,
  date2?: dayjs.ConfigType,
  unit: dayjs.ManipulateType = "minute",
): number => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE);
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE);
  return _date2.diff(_date1, unit);
};

export const businessTimestampIsAfter = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE);
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE);
  return _date2.isAfter(_date1);
};

export const businessTimestampIsBefore = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE);
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE);
  return _date2.isBefore(_date1);
};

export const businessTimestampIsSame = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE);
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE);
  return _date2.isSame(_date1);
};

export const businessTimestampIsSameOrAfter = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE);
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE);
  return _date2.isSameOrAfter(_date1);
};

export const businessTimestampIsSameOrBefore = (date1: dayjs.ConfigType, date2?: dayjs.ConfigType): boolean => {
  const _date1 = dayjs(date1).tz(BUSINESS_TIMEZONE);
  const _date2 = dayjs(date2).tz(BUSINESS_TIMEZONE);
  return _date2.isSameOrBefore(_date1);
};

export const businessTimestampAdd = (
  amount: number,
  date?: dayjs.ConfigType,
  unit: dayjs.ManipulateType = "minute",
): Date => {
  const _date = dayjs(date).tz(BUSINESS_TIMEZONE);
  return _date.add(amount, unit).toDate();
};

export const businessTimestampSubtract = (
  amount: number,
  date?: dayjs.ConfigType,
  unit: dayjs.ManipulateType = "minute",
): Date => {
  const _date = dayjs(date).tz(BUSINESS_TIMEZONE);
  return _date.subtract(amount, unit).toDate();
};

export const businessTimestamp = (date?: dayjs.ConfigType): Date => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).toDate();
};

export const formatBusinessTimestamp = (date?: dayjs.ConfigType, format: string = "LLL"): string => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).format(format);
};

export const totalDaysInMonth = (date?: dayjs.ConfigType): number => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).daysInMonth();
};

export const maxDaysInMonth = (month: number, year = dayjs().year()): number => {
  return dayjs()
    .tz(BUSINESS_TIMEZONE)
    .year(year)
    .month(month - 1)
    .daysInMonth();
};

export const startOfMonth = (date?: dayjs.ConfigType): Date => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).startOf("month").toDate();
};

export const endOfMonth = (date?: dayjs.ConfigType): Date => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).endOf("month").toDate();
};

export const dayOfMonth = (date?: dayjs.ConfigType): number => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).date();
};

export const dayOfWeek = (date?: dayjs.ConfigType): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).day();
};

export const month = (date?: dayjs.ConfigType): number => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).month() + 1;
};

export const year = (date?: dayjs.ConfigType): number => {
  return dayjs(date).tz(BUSINESS_TIMEZONE).year();
};

export function nextMonday(date?: dayjs.ConfigType): Date {
  const today = dayjs(date).tz(BUSINESS_TIMEZONE);
  const daysUntilMonday = (8 - today.day()) % 7 || 7;
  return today.add(daysUntilMonday, "day").toDate();
}
