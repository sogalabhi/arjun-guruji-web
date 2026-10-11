// Kannada Amanta years begin with Chaitra, including when Ugadi is in April.
// These are elapsed Shalivahana/Kali years, not the national civil calendar.
export function calendarYears(year, month, masaIndex, samvatsaraNames) {
  const shaka = year - 78 - (month <= 4 && masaIndex >= 9 ? 1 : 0);
  return { shaka, kali: shaka + 3179, samvatsara: samvatsaraNames[((shaka + 11) % 60 + 60) % 60] };
}

// Traditional weekday assignment. Tuesday's second window uses night length.
// The npm 3.0.0 Dur Muhurta table differs from published Kannada Panchangas.
export function durMuhurtas(sunrise, sunset, nextSunrise, weekday) {
  const offsets = [[13], [8, 11], [3], [7], [5, 11], [3, 8], [0, 1]][weekday];
  const dayMuhurta = (sunset - sunrise) / 15;
  const windows = offsets.map((offset) => ({ start: sunrise + offset * dayMuhurta, end: sunrise + (offset + 1) * dayMuhurta }));
  if (weekday === 2 && Number.isFinite(nextSunrise)) {
    const nightMuhurta = (nextSunrise - sunset) / 15;
    windows.push({ start: sunset + 7 * nightMuhurta, end: sunset + 8 * nightMuhurta });
  }
  return windows;
}

export const WEEKDAY_COLOURS = ["Red", "White", "Red", "Green", "Yellow", "White", "Blue"];
