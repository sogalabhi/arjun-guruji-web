// Import the calculation entry points directly: the package's main barrel
// also exports a Node-only file exporter, which browser builds do not need.
import { getSunrise, getSunset, getMoonrise, getMoonset } from "@ishubhamx/panchangam-js/dist/core/rise-set.js";
import { getMasa } from "@ishubhamx/panchangam-js/dist/core/masa.js";
import { findTithiTransitions, findTithiEnd, findNakshatraEnd, findYogaEnd, findNakshatraTransitions, findYogaTransitions } from "@ishubhamx/panchangam-js/dist/core/transitions.js";
import { getAyanamsa } from "@ishubhamx/panchangam-js/dist/ephemeris/ayanamsa.js";
import { getTithi, getPaksha } from "@ishubhamx/panchangam-js/dist/calendar/tithi.js";
import { calculateRahuKalam, calculateYamagandaKalam, calculateGulikaKalam } from "@ishubhamx/panchangam-js/dist/muhurta/rahu-kaal.js";
import { getNakshatra } from "@ishubhamx/panchangam-js/dist/calendar/nakshatra.js";
import { getYoga } from "@ishubhamx/panchangam-js/dist/calendar/yoga.js";
import { getKarana } from "@ishubhamx/panchangam-js/dist/calendar/karana.js";
import { getRashi } from "@ishubhamx/panchangam-js/dist/calendar/rashi.js";
import { getAyana, getRitu } from "@ishubhamx/panchangam-js/dist/calendar/ayana-ritu.js";
import { calculateAbhijitMuhurta } from "@ishubhamx/panchangam-js/dist/muhurta/abhijit.js";
import { tithiNames, nakshatraNames, yogaNames, rituNames, samvatsaraNames } from "@ishubhamx/panchangam-js/dist/core/constants.js";
import { Observer, GeoVector, Ecliptic, Body, Search, MakeTime, SearchRiseSet } from "astronomy-engine";
import { createPanchangEngine } from "./panchangCalculations.js";

export default createPanchangEngine({ getSunrise, getSunset, getMoonrise, getMoonset, getMasa, findTithiTransitions, findTithiEnd, findNakshatraEnd, findYogaEnd, findNakshatraTransitions, findYogaTransitions, getAyanamsa, getTithi, getPaksha, getNakshatra, getYoga, getKarana, getRashi, getAyana, getRitu, calculateAbhijitMuhurta, calculateRahuKalam, calculateYamagandaKalam, calculateGulikaKalam, tithiNames, nakshatraNames, yogaNames, rituNames, samvatsaraNames, Observer, GeoVector, Ecliptic, Body, Search, MakeTime, SearchRiseSet });
