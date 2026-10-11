// Import the calculation entry points directly: the package's main barrel
// also exports a Node-only file exporter, which browser builds do not need.
import { getSunrise, getSunset } from "@ishubhamx/panchangam-js/dist/core/rise-set.js";
import { getMasa } from "@ishubhamx/panchangam-js/dist/core/masa.js";
import { findTithiTransitions } from "@ishubhamx/panchangam-js/dist/core/transitions.js";
import { getAyanamsa } from "@ishubhamx/panchangam-js/dist/ephemeris/ayanamsa.js";
import { getTithi, getPaksha } from "@ishubhamx/panchangam-js/dist/calendar/tithi.js";
import { calculateRahuKalam, calculateYamagandaKalam, calculateGulikaKalam } from "@ishubhamx/panchangam-js/dist/muhurta/rahu-kaal.js";
import { tithiNames } from "@ishubhamx/panchangam-js/dist/core/constants.js";
import { Observer, GeoVector, Ecliptic, Body } from "astronomy-engine";
import { createPanchangEngine } from "./panchangCalculations.js";

export default createPanchangEngine({ getSunrise, getSunset, getMasa, findTithiTransitions, getAyanamsa, getTithi, getPaksha, calculateRahuKalam, calculateYamagandaKalam, calculateGulikaKalam, tithiNames, Observer, GeoVector, Ecliptic, Body });
