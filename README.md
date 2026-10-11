# Arjun Guruji website

React + Vite website using public, read-only Firestore data in `arjun-guruji-app`. Development and builds use Node.js and npm.

## Development

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run preview
```

The Firebase web config in `src/firebase.js` is public. Firestore security rules control access; no service-account credentials belong in this website.

## Current pages

- Home: Guruji image, a Today card with tithi, Rahu Kaala and the next valid programme, six content tiles, and Settings.
- Books, Astottara, and Lyrics: searchable Firestore lists and shareable readers, with saved position, themes, fonts, text size, contents, and search. PDF books open in a new tab.
- Contact: phone, WhatsApp channel, both locations and map links, Kannada bus directions, social links, and email.
- Events (`/events`): happening now, weekly programmes, upcoming events, and collapsed past events/photos. Details include the schedule, venue/map, photos with a full-screen viewer, video links, and read-only interest counts.
- Calendar (`/events/calendar`): month navigation and programme counts; selecting a day shows overlapping events, bounded weekly occurrences, and Panchang.
- Panchang (`/panchang`): full daily details in Kannada, with an English option. Includes elapsed Shaka/Kali years, Samvatsara, Ayana, lunar/solar Ritu, Gregorian date/month, weekday/colour, Paksha, Amanta month, Tithi/Nakshatra/Yoga end times, all Karanas, Sun/Moon Rashis, rise/set times, day/night durations, Rahu/Yamaganda/Gulika, Abhijit and Dur Muhurtas. Date and searchable city selection remain shareable; the city is saved locally.
- Audio (`/audio`): category tiles with track counts, then a track list with Play all and Shuffle, and a shareable player (`/audio/:categoryId/:trackId`) with artwork, lyrics and an Up next list. Controls are Previous, Play/Pause, Next, Back 10 s, Forward 10 s, Shuffle and Repeat (Off, All, One), all with text labels; Shuffle and Repeat are saved locally. One audio element lives above the router, so playback continues on every page, with a mini player (Play/Pause and Close) and lock-screen controls through the Media Session API. A shared player link opens paused. Legacy `/songs` redirects to Audio and `/gallery` to Events.
- `/status`: a Firestore connectivity check.

Notifications and donations are deferred and have no navigation entry.

The Today card handles weekly recurrence, filters expired/cancelled/completed events, and uses IST independently of the browser's time zone. Event data expires after five minutes; the date and schedule update when an open tab returns to the foreground. Multi-day events stay visible through their final civil day, and recently ended programmes appear under Past events.

## Panchang calculations

[`@ishubhamx/panchangam-js`](https://www.npmjs.com/package/@ishubhamx/panchangam-js) is pinned to 3.0.0, with `astronomy-engine` 2.1.19. Both declare MIT licenses. The calculation modules load asynchronously when Home, Calendar or Panchang needs them. No remote Panchang API, generated engine file or separate SDK build is required.

`src/data/panchangEngine.js` imports browser calculation modules directly because the package's root also exports a Node file writer. Vite resolves a single CommonJS astronomy-engine instance so its Observer constructor matches the package's internal checks.

The website uses amanta lunar months, explicit IST civil dates and 69 Indian cities. Tithi is anchored at sunrise; segments cover midnight to midnight. Mysuru and Bengaluru are accepted as city aliases. Package 3.0.0 returns zero-based tithi indices, despite its type comment describing 1–30.

Full details are calculated only for `/panchang`; Home and Calendar retain the compact summary. Detail transition lists cover sunrise to the following sunrise, and mark their clipped final windows separately from actual end times. Moonrise/moonset show the first event after the selected sunrise, including events after midnight. A separate civil-day check identifies dates with no moon event. Both traditional extended-hour notation (`30:29:03`) and 24-hour clock notation (`06:29:03`) retain an explicit next-day label and seconds.

`src/data/panchangConventions.js` supplies elapsed years from the sunrise Amanta month (including April year boundaries), the 60-year Samvatsara cycle, weekday colours and traditional Dur Muhurta assignments. The Kali year is the elapsed Shaka year + 3179. These years follow the month at sunrise; on an Ugadi date when Pratipada begins after sunrise, the year remains the preceding sunrise year until the next day. Lunar Ritu follows pairs of lunar months; solar/Drik Ritu and Ayana use tropical longitude, while Vedic Ayana uses sidereal longitude. City coordinates use the existing registry and elevation is 0 m. Kannada translations are separate from calculation code, with context-specific month/nakshatra vocabulary.

Two v3.0.0 behaviors need application corrections: the Karana scanner misses Naga's new-moon boundary, and its Dur Muhurta weekday table differs from published Kannada Panchangas. The website searches Karana roots with the same apparent longitudes as Tithi, including the 360° wrap, and supplies weekday Dur Muhurtas with Tuesday's night window and Saturday's two morning windows. Abhijit is omitted on Wednesday, following the reference convention.

`npm test` compares five dates across Mysore, Bangalore and Mumbai against saved reference results. Tithi, lunar month, sunrise/sunset, Rahu Kaala and transitions agree within five seconds, allowing spelling variants. Yamaganda/Gulika use the npm package's weekday assignments, which are the accepted convention; the previous app reference used different assignments, so those two fields have separate checks. Calculations also run against UTC, IST and US DST host timezones.

Detailed regression tests compare October 1–10, 2026 against [published Mysuru Panchanga observations](https://www.mypanchang.com/phppanchang.php?cityname=Mysore-Karnataka-India&mn=09&monthtype=0&yr=2026): Tithi, Nakshatra and Yoga names agree, with their end times within 30 seconds. Rise/set values are not asserted against that source because location and sunrise conventions differ. These checks complement coverage for new-moon Karanas, missing civil-day moonrise, durations, March/April year boundaries, weekday Muhurtas, complete Kannada vocabulary, extended times and host timezone independence. Comparison with Guruji's own source Panchanga is not planned; the published Mysuru observations are the accepted reference.

## Hosting

Production files are generated in `dist/`. Firebase Hosting and Vercel configs provide SPA fallback for shared links and page refreshes. Publishing remains a separate step from building.

See [the website revamp plan](docs/web_rebuild_plan.md) for current scope. Real iPhone Safari and installed home-screen behavior still need device checks before release.

Initial Phase 3 validation passed build, lint, 31 JavaScript tests, and Chromium checks across seven mobile/landscape/tablet widths in development and production builds. The detail expansion passes build, lint and 49 tests, plus 56 Chromium layout checks across seven widths in both builds. Kannada/English fields, both time formats, date/city changes and persistence, offline date calculations, missing moonrise, Wednesday Abhijit, year boundaries and module-download Retry were checked with no page errors. Error recovery preserves the shared date/city URL.
