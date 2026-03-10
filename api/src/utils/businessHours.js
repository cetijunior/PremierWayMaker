const BUSINESS_TIMEZONE = 'Europe/Tirane';
const BUSINESS_OPEN_MINUTES = 8 * 60; // 08:00
const BUSINESS_CLOSE_MINUTES = 18 * 60; // 18:00

function getTiranaTimeParts(date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIMEZONE,
    hour12: false,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const parts = formatter.formatToParts(date);

  const find = (type) => parts.find((p) => p.type === type)?.value;

  const weekday = find('weekday'); // e.g. Mon, Tue, ...
  const year = Number(find('year'));
  const month = Number(find('month'));
  const day = Number(find('day'));
  const hour = Number(find('hour'));
  const minute = Number(find('minute'));

  return { weekday, year, month, day, hour, minute };
}

function isWithinBusinessHours(start, end) {
  const startParts = getTiranaTimeParts(start);
  const endParts = getTiranaTimeParts(end);

  // Require that the booking occurs on a single calendar day in Tirana local time.
  if (
    startParts.year !== endParts.year ||
    startParts.month !== endParts.month ||
    startParts.day !== endParts.day
  ) {
    return {
      ok: false,
      reason: 'Booking start and end must be on the same day in Tirana local time.',
    };
  }

  // Only allow Monday–Friday in Tirana.
  if (startParts.weekday === 'Sat' || startParts.weekday === 'Sun') {
    return {
      ok: false,
      reason: 'Bookings are only available Monday–Friday between 08:00 and 18:00 (Tirana local time).',
    };
  }

  const startMinutes = startParts.hour * 60 + startParts.minute;
  const endMinutes = endParts.hour * 60 + endParts.minute;

  // Start must be within [08:00, 18:00), end within (08:00, 18:00], and end after start.
  if (startMinutes < BUSINESS_OPEN_MINUTES || startMinutes >= BUSINESS_CLOSE_MINUTES) {
    return {
      ok: false,
      reason: 'Booking start time must be between 08:00 and 18:00 (Tirana local time).',
    };
  }

  if (endMinutes <= BUSINESS_OPEN_MINUTES || endMinutes > BUSINESS_CLOSE_MINUTES) {
    return {
      ok: false,
      reason: 'Booking end time must be between 08:00 and 18:00 and may not be later than 18:00 (Tirana local time).',
    };
  }

  if (endMinutes <= startMinutes) {
    return {
      ok: false,
      reason: 'Booking end time must be after start time.',
    };
  }

  return { ok: true };
}

module.exports = {
  BUSINESS_TIMEZONE,
  BUSINESS_OPEN_MINUTES,
  BUSINESS_CLOSE_MINUTES,
  isWithinBusinessHours,
};

