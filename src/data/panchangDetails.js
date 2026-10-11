import { DAY_MS } from "./dates.js";
import { calendarYears, durMuhurtas, WEEKDAY_COLOURS } from "./panchangConventions.js";

const millis = (date) => date?.getTime() ?? null;
const period = (value) => value ? { start: millis(value.start), end: millis(value.end) } : null;
const sidereal = (longitude, ayanamsa) => (longitude - ayanamsa + 360) % 360;

// Keep scanner boundaries continuous, and distinguish a clipped final window
// from an actual transition. A window ending at next sunrise isn't an end time.
function windows(segments, start, end) {
  return segments.map((segment, index) => ({
    index: segment.index, name: segment.name,
    start: index ? millis(segments[index - 1].endTime) : start,
    end: Math.min(end, millis(segment.endTime)),
    endsWithinDay: millis(segment.endTime) < end,
  }));
}

function karanaWindows(api, sunrise, nextSunrise) {
  const result = [];
  let cursor = sunrise;
  let boundary = +sunrise;
  const longitude = (body, time) => api.Ecliptic(api.GeoVector(body, time, true)).elon;
  const phase = (time) => (longitude(api.Body.Moon, time) - longitude(api.Body.Sun, time) + 360) % 360;
  while (boundary < +nextSunrise) {
    const target = ((Math.floor(phase(cursor) / 6) + 1) * 6) % 360;
    // The package's Karana scanner misses the 360→0 Naga transition in v3.
    // Search the same apparent longitudes as the package's Tithi calculation,
    // making the angle continuous across zero for Astronomy Engine's solver.
    const root = api.Search((time) => ((phase(time) - target + 540) % 360) - 180, api.MakeTime(cursor), api.MakeTime(new Date(+cursor + 2 * DAY_MS)))?.date;
    const end = root ? Math.min(+root, +nextSunrise) : +nextSunrise;
    if (end <= boundary) throw new Error("Could not calculate Karana transitions.");
    const sun = api.Ecliptic(api.GeoVector(api.Body.Sun, cursor, true)).elon;
    const moon = api.Ecliptic(api.GeoVector(api.Body.Moon, cursor, true)).elon;
    result.push({ name: api.getKarana(sun, moon), start: boundary, end, endsWithinDay: root != null && +root < +nextSunrise });
    boundary = end;
    cursor = new Date(boundary + 1000);
  }
  return result;
}

export function calculateDetails(api, { year, month, day, date, observer, sunrise, sunset, sunLongitude, moonLongitude, ayanamsa, masa, weekday, coordinates }) {
  const nextDate = new Date(+date + DAY_MS);
  const nextSunrise = api.getSunrise(nextDate, observer, { timezoneOffset: 330 });
  if (!nextSunrise) throw new Error("The next sunrise is unavailable for this location.");
  const sunSidereal = sidereal(sunLongitude, ayanamsa);
  const moonSidereal = sidereal(moonLongitude, ayanamsa);
  const nakshatra = api.getNakshatra(moonSidereal);
  const yoga = api.getYoga(sunSidereal, moonSidereal);
  return {
    year, month, day, weekday, colour: WEEKDAY_COLOURS[weekday],
    latitude: coordinates[0], longitude: coordinates[1], elevation: observer.height,
    calendarType: "amanta", timezone: "Asia/Kolkata",
    ...calendarYears(year, month, masa.index, api.samvatsaraNames),
    ayana: api.getAyana(sunSidereal), drikAyana: api.getAyana(sunLongitude),
    ritu: api.rituNames[Math.floor(masa.index / 2)], drikRitu: api.getRitu(sunLongitude),
    isAdhika: masa.isAdhika,
    tithiEnd: millis(api.findTithiEnd(sunrise)),
    nakshatraName: api.nakshatraNames[nakshatra], nakshatraEnd: millis(api.findNakshatraEnd(sunrise, ayanamsa)),
    yogaName: api.yogaNames[yoga], yogaEnd: millis(api.findYogaEnd(sunrise, ayanamsa)),
    moonRashi: api.getRashi(moonSidereal).name, sunRashi: api.getRashi(sunSidereal).name,
    nextSunrise: millis(nextSunrise), dayDuration: +sunset - +sunrise, nightDuration: +nextSunrise - +sunset,
    // Traditional Panchanga rise/set: first event after this day's sunrise.
    // It may fall after civil midnight (or just beyond the next sunrise).
    moonrise: millis(api.SearchRiseSet(api.Body.Moon, observer, 1, sunrise, 2)?.date),
    moonset: millis(api.SearchRiseSet(api.Body.Moon, observer, -1, sunrise, 2)?.date),
    civilMoonrise: millis(api.getMoonrise(date, observer, { timezoneOffset: 330 })),
    civilMoonset: millis(api.getMoonset(date, observer, { timezoneOffset: 330 })),
    abhijit: weekday === 3 ? null : period(api.calculateAbhijitMuhurta(sunrise, sunset)),
    durMuhurtas: durMuhurtas(+sunrise, +sunset, +nextSunrise, weekday),
    tithis: windows(api.findTithiTransitions(sunrise, nextSunrise), +sunrise, +nextSunrise),
    nakshatras: windows(api.findNakshatraTransitions(sunrise, nextSunrise, ayanamsa), +sunrise, +nextSunrise),
    yogas: windows(api.findYogaTransitions(sunrise, nextSunrise, ayanamsa), +sunrise, +nextSunrise),
    karanas: karanaWindows(api, sunrise, nextSunrise),
  };
}
