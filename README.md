# Arjun Guruji website

React + Vite website using the Flutter app's public, read-only Firestore data in `arjun-guruji-app`.

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

- Home: Guruji image, a Today card with the next valid programme, six content tiles, and Settings.
- Books, Astottara, and Lyrics: searchable Firestore lists and shareable readers, with saved position, themes, fonts, text size, contents, and search. PDF books open in a new tab.
- Contact: phone, WhatsApp channel, both locations and map links, Kannada bus directions, social links, and email. Contact details mirror the Flutter app.
- Bhajans (`/audio`) and Events (`/events`): placeholders until the audio and events phases. Legacy `/songs` and `/gallery` URLs redirect to these pages.
- `/status`: a Firestore connectivity check.

Notifications and donations are deferred and have no navigation entry.

The Today card handles weekly recurrence, filters expired/cancelled/completed events, and uses IST independently of the browser's time zone. Event data expires after five minutes; the date and schedule update when an open tab returns to the foreground. `npm test` covers event selection and date boundaries.

## Hosting

Production files are generated in `dist/`. Firebase Hosting and Vercel configs provide SPA fallback for shared links and page refreshes. Publishing remains a separate step from building.

Phase 2 has been checked in Chromium at mobile, landscape, and tablet widths. Real iPhone Safari and installed home-screen behavior still need device checks.
