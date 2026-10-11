import { dateMillis, DAY_MS, validDate } from "./dates.js";
import { CITIES, normalizeCity } from "./panchangCities.js";
import { calculateDetails } from "./panchangDetails.js";

// Both sunrise-day values and midnight-to-midnight segments are explicit.
// The package's default month convention is purnimanta; this site uses amanta.
export function createPanchangEngine(api) {
  return {
    version: "3.0.0",
    cities: () => Object.keys(CITIES).sort(),
    getForDate(year, month, day, city, detailed = false) {
      const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const name = normalizeCity(city);
      if (!validDate(key) || !name) return null;
      const start = dateMillis(key);
      const end = start + DAY_MS;
      const observer = new api.Observer(...CITIES[name], 0);
      const date = new Date(start + 12 * 3600000);
      const sunrise = api.getSunrise(date, observer, { timezoneOffset: 330 });
      const sunset = api.getSunset(date, observer, { timezoneOffset: 330 });
      if (!sunrise || !sunset) return null;
      const sunLongitude = api.Ecliptic(api.GeoVector(api.Body.Sun, sunrise, true)).elon;
      const moonLongitude = api.Ecliptic(api.GeoVector(api.Body.Moon, sunrise, true)).elon;
      const tithi = api.getTithi(sunLongitude, moonLongitude);
      const paksha = api.getPaksha(tithi);
      const ayanamsa = api.getAyanamsa(sunrise);
      const masa = api.getMasa((sunLongitude - ayanamsa + 360) % 360, (moonLongitude - ayanamsa + 360) % 360, sunrise, "amanta");
      const weekday = new Date(`${key}T00:00:00Z`).getUTCDay();
      const rahu = api.calculateRahuKalam(sunrise, sunset, weekday);
      const yama = api.calculateYamagandaKalam(sunrise, sunset, weekday);
      const gulika = api.calculateGulikaKalam(sunrise, sunset, weekday);
      // Version 3 returns zero-based tithi indices despite the type comment.
      const tithiName = api.tithiNames[tithi];
      const lunarMonth = masa.name;
      const transitions = api.findTithiTransitions(new Date(start), new Date(end));
      return {
        city: name, tithiName, paksha, lunarMonth,
        displayName: `${lunarMonth} ${paksha} ${tithiName}`,
        sunrise: sunrise.getTime(), sunset: sunset.getTime(),
        rahuStart: rahu.start.getTime(), rahuEnd: rahu.end.getTime(),
        yamagandaStart: yama.start.getTime(), yamagandaEnd: yama.end.getTime(),
        gulikaStart: gulika.start.getTime(), gulikaEnd: gulika.end.getTime(),
        // The scanner advances one minute past each root. Display contiguous
        // windows using the previous root, retaining the scanner's tithi.
        segments: transitions.map((segment, index) => ({ tithiName: segment.name, paksha: segment.index < 15 ? "Shukla" : "Krishna", start: index === 0 ? start : transitions[index - 1].endTime.getTime(), end: Math.min(end, segment.endTime.getTime()) })),
        ...(detailed ? { details: calculateDetails(api, { year, month, day, date, observer, sunrise, sunset, sunLongitude, moonLongitude, ayanamsa, masa, weekday, coordinates: CITIES[name] }) } : {}),
      };
    },
  };
}
