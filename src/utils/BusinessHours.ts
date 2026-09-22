
import type { BusinessDay, BusinessHours } from "../types/store.js";

const days = [
  "sunday", "monday", "tuesday", "wednesday",
  "thursday", "friday", "saturday",
] as const;

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h !== undefined && m !== undefined ? h * 60 + m : null;
};

export const isStoreOpen = (
  hours: BusinessHours,
  vacation: boolean,
  date = new Date(),
) => {
  if (vacation) return false;

  const min = date.getHours() * 60 + date.getMinutes();
  const day = days[date.getDay()];

  if (!day) return false;

  const previousDay = days[(date.getDay() + 6) % 7];

  if (!previousDay) return false;

  const check = (d: BusinessDay | undefined, previous = false) => {
    if (!d || d.closed || !d.open || !d.close) return false;

    const open = toMinutes(d.open);
    const close = toMinutes(d.close);

    if (open === null || close === null) return false;

    if (previous) return open > close && min < close;

    return open === close
      ? true
      : open < close
        ? min >= open && min < close
        : min >= open;
  };

  return check(hours[day]) || check(hours[previousDay], true);
};