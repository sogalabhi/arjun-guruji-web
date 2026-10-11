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
- Panchang (`/panchang`): date and searchable city selection, tithi at sunrise, lunar month, sunrise/sunset, Rahu Kaala, Yamaganda, Gulika and tithi segments. The city is saved locally; date/city query parameters are shareable.
- Bhajans (`/audio`): placeholder until Phase 4. Legacy `/songs` and `/gallery` URLs redirect to Audio and Events.
- `/status`: a Firestore connectivity check.

Notifications and donations are deferred and have no navigation entry.

The Today card handles weekly recurrence, filters expired/cancelled/completed events, and uses IST independently of the browser's time zone. Event data expires after five minutes; the date and schedule update when an open tab returns to the foreground. Multi-day events stay visible through their final civil day, and recently ended programmes appear under Past events.

## Panchang calculations

[`@ishubhamx/panchangam-js`](https://www.npmjs.com/package/@ishubhamx/panchangam-js) is pinned to 3.0.0, with `astronomy-engine` 2.1.19. Both declare MIT licenses. The calculation modules load asynchronously when Home, Calendar or Panchang needs them. No remote Panchang API, generated engine file or separate SDK build is required.

`src/data/panchangEngine.js` imports browser calculation modules directly because the package's root also exports a Node file writer. Vite resolves a single CommonJS astronomy-engine instance so its Observer constructor matches the package's internal checks.

The website uses amanta lunar months, explicit IST civil dates and 69 Indian cities. Tithi is anchored at sunrise; segments cover midnight to midnight. Mysuru and Bengaluru are accepted as city aliases. Package 3.0.0 returns zero-based tithi indices, despite its type comment describing 1–30.

`npm test` compares five dates across Mysore, Bangalore and Mumbai against saved reference results. Tithi, lunar month, sunrise/sunset, Rahu Kaala and transitions agree within five seconds, allowing spelling variants. Yamaganda/Gulika use the npm package's weekday assignments; the previous app reference used different assignments, so those two fields have separate checks. Calculations also run against UTC, IST and US DST host timezones.

## Hosting

Production files are generated in `dist/`. Firebase Hosting and Vercel configs provide SPA fallback for shared links and page refreshes. Publishing remains a separate step from building.

See [the website revamp plan](docs/web_rebuild_plan.md) for current scope. Real iPhone Safari and installed home-screen behavior still need device checks before release.

Phase 3 passed build, lint, 31 JavaScript tests, and Chromium checks across seven mobile/landscape/tablet widths in development and production builds. Error recovery includes retrying event requests and restarting the page after a failed Panchang module download, preserving its shared date/city URL.
