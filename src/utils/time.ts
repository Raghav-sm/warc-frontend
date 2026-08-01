import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { BUSINESS_TIMEZONE } from "./date";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const businessTimeDiff = (
  time1: dayjs.ConfigType,
  time2?: dayjs.ConfigType,
  unit?: dayjs.QUnitType | dayjs.OpUnitType,
): number => {
  const _time1 = businessTime(time1);
  const _time2 = businessTime(time2);
  return _time2.diff(_time1, unit, true);
};

export const businessTimeIsSame = (time1: dayjs.ConfigType, time2?: dayjs.ConfigType): boolean => {
  const _time1 = businessTime(time1);
  const _time2 = businessTime(time2);
  return _time2.isSame(_time1);
};

export const businessTimeIsBefore = (time1: dayjs.ConfigType, time2?: dayjs.ConfigType): boolean => {
  const _time1 = businessTime(time1);
  const _time2 = businessTime(time2);
  return _time2.isBefore(_time1);
};

export const businessTimeIsSameOrBefore = (time1: dayjs.ConfigType, time2?: dayjs.ConfigType): boolean => {
  const _time1 = businessTime(time1);
  const _time2 = businessTime(time2);
  return _time2.isSameOrBefore(_time1);
};

export const businessTimeIsAfter = (time1: dayjs.ConfigType, time2?: dayjs.ConfigType): boolean => {
  const _time1 = businessTime(time1);
  const _time2 = businessTime(time2);
  return _time2.isAfter(_time1);
};

export const businessTimeIsSameOrAfter = (time1: dayjs.ConfigType, time2?: dayjs.ConfigType): boolean => {
  const _time1 = businessTime(time1);
  const _time2 = businessTime(time2);
  return _time2.isSameOrAfter(_time1);
};

export const businessTimeAdd = (amount: number, time?: dayjs.ConfigType, unit?: dayjs.ManipulateType): dayjs.Dayjs => {
  return businessTime(time).add(amount, unit);
};

export const businessTimeSubtract = (amount: number, time?: dayjs.ConfigType, unit?: dayjs.ManipulateType): dayjs.Dayjs => {
  return businessTime(time).subtract(amount, unit);
};

export const businessTime = (time?: dayjs.ConfigType): dayjs.Dayjs => {
  // No input → current business-tz time-of-day.
  if (time === undefined || time === null) {
    return dayjs(dayjs().tz(BUSINESS_TIMEZONE).format("HH:mm:ss"), "HH:mm:ss", true);
  }
  // Already a normalized time-of-day (the businessTime* helpers re-wrap their args) — pass through.
  if (dayjs.isDayjs(time)) return time;
  // A real instant (e.g. a clock-in/out timestamp) → reduce to its time-of-day in the business tz.
  if (time instanceof Date) {
    return dayjs(dayjs(time).tz(BUSINESS_TIMEZONE).format("HH:mm:ss"), "HH:mm:ss", true);
  }
  // Otherwise a bare "HH:mm:ss" string.
  return dayjs(time, "HH:mm:ss", true);
};

export const formatBusinessTime = (time?: dayjs.ConfigType): string => {
  return businessTime(time).format("h:mm A");
};
