# Website revamp plan

The website is React + JavaScript, built with Vite and npm. Content comes from the existing public Firestore collections. Notifications and donations are deferred.

## Completed and published to the repository

- Phase 0: shared layout, branding, fonts, Firebase connection, safe areas, metadata and hosting rewrites.
- Phase 1: Books, Astottara and Lyrics lists/readers, search, saved reading position and reader settings.
- Phase 2: Home, Today programme summary, six navigation tiles, Contact, maps and social links.

## Phase 3: Events and Panchang

Implemented and validated.

- Use `@ishubhamx/panchangam-js` 3.0.0 through npm. Load browser calculation modules asynchronously, with explicit IST dates and amanta lunar months.
- Panchang page with date selection, searchable Indian cities, persisted city preference, sunrise tithi, lunar month, sunrise/sunset, Rahu Kaala, Yamaganda, Gulika and tithi segments.
- Home Today card with tithi, Rahu Kaala, and a link to the next programme's details.
- Event lists grouped into happening now, weekly programmes, upcoming, and collapsed past events/photos. Multi-day events remain visible and recently ended events have no seven-day gap.
- Shareable event details: description, activities, venue/map, photos with a full-screen viewer, videos, and a read-only interest count.
- Calendar month grid with programme counts; day selection shows events and Panchang.
- Keep implementation in this website repository. Native app changes are outside the current scope.

Acceptance checks: unit tests for date/grouping boundaries; five dates × three cities for Panchang reference comparisons; timezone independence; browser checks for shared URLs, refresh, city persistence, gallery keyboard controls, errors/empty states and narrow-screen layouts.

Validation passed: build, lint and 31 JavaScript tests; Chromium checks at seven widths (320–1024 px) on five routes in both development and production builds, with no page errors. Shared event links, live Firestore data, city/date persistence, photo navigation/focus, event-load Retry and Panchang-download Retry were checked. Real iPhone Safari remains a release-stage device check.

The npm engine uses different Yamaganda/Gulika weekday assignments from the old app reference. These follow the library's conventions and have separate regression checks. Minute labels for the other timing fields match the reference sample.

## Phase 4: Audio

- Category grid and track lists from Firestore categories/audio subcollections.
- Player with artwork, seeking, previous/next, shuffle, repeat, lyrics and playlist.
- Persistent mini player across routes with safe-area clearance.
- Media Session metadata and playback controls for supported lock screens.
- Save the last track/position and offer Continue; verify user-initiated playback and background behavior on iPhone Safari.

## Phase 5: Polish and release

- Accessibility review, keyboard/focus behavior, contrast and comfortable tap targets.
- Responsive layouts, loading/error recovery, image and bundle performance.
- Metadata, installability and real-device QA for iPhone Safari and home-screen use.
- Production hosting/deployment checks, including shared links and page refreshes.

Notifications and donations remain deferred until separately requested.
