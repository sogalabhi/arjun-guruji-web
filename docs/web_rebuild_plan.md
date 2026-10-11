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
- Full Panchang detail page: Kannada/English names, elapsed Shaka/Kali years, Samvatsara, weekday/colour, lunar and solar Ritu/Ayana, Nakshatra/Yoga end times, every Karana, Sun/Moon Rashis, moonrise/moonset, day/night duration, Abhijit/Dur Muhurtas, sunrise-day transition lists and second-precision 24+ or normal clock times.
- Home Today card with tithi, Rahu Kaala, and a link to the next programme's details.
- Event lists grouped into happening now, weekly programmes, upcoming, and collapsed past events/photos. Multi-day events remain visible and recently ended events have no seven-day gap.
- Shareable event details: description, activities, venue/map, photos with a full-screen viewer, and videos. The interest count is not shown.
- Calendar month grid with programme counts; day selection shows events and Panchang.
- Keep implementation in this website repository. Native app changes are outside the current scope.

Acceptance checks: unit tests for date/grouping boundaries; five dates × three cities for Panchang reference comparisons; timezone independence; browser checks for shared URLs, refresh, city persistence, gallery keyboard controls, errors/empty states and narrow-screen layouts.

Initial Phase 3 validation passed: build, lint and 31 JavaScript tests; Chromium checks at seven widths (320–1024 px) on five routes in both development and production builds, with no page errors. Shared event links, live Firestore data, city/date persistence, photo navigation/focus, event-load Retry and Panchang-download Retry were checked. Real iPhone Safari remains a release-stage device check.

The npm engine uses different Yamaganda/Gulika weekday assignments from the old app reference. These follow the library's conventions, which are the accepted assignments, and have separate regression checks. Minute labels for the other timing fields match the reference sample.

Panchang details additionally correct the v3.0.0 Naga transition and supply traditional Dur Muhurta weekday assignments. Tests compare ten published Mysuru dates for Tithi/Nakshatra/Yoga names and end times (30-second tolerance), plus year boundaries, lunar/solar conventions, Kannada vocabulary, durations, moon events and time notation. Comparison with the trust's own almanac is not planned; the published Mysuru observations are the accepted reference.

Detail expansion validation passed: build, lint and 49 JavaScript tests; 56 Chromium layout checks across seven widths in development and production, with no page errors. Both languages/time formats, every requested field, offline date changes, saved/shared city and date, missing moonrise, Wednesday Abhijit, year boundaries, invalid inputs and Panchang-download Retry were checked.

## Phase 4: Audio

Implemented. Build, lint and 67 JavaScript tests pass; owner-tested in the browser; real iPhone and Android checks (locked-screen playback, lock-screen controls) remain. Parity with the app's Audio feature (`lib/features/AudioPlayer`), plus one extra: Back 10 s / Forward 10 s buttons. The section is called "Audio", as in the app.

### Data

- `categories` documents: `name`, `imageUrl`. Each has an `audios` subcollection: `title`, `audioUrl`, `imageUrl`, `lyrics` (plain text with line breaks), `category` (display name).
- Live data has 4 categories and 21 tracks. Arati, Astottara, Bhaja gurunatham and Bhuvanada bhagya. One Bhuvanada bhagya track has an empty title; show "Untitled track".
- `src/data/audio.js`: `getAudioLibrary()` fetches the categories and every category's `audios` together (5 small requests, in parallel) through `cached()`. This replaces the earlier idea of fetching a category's tracks only when it is opened: the whole library is small, it gives track counts on the category tiles, and a shared player link can find any track. Firestore document order is kept, as in the app. Tracks without an `audioUrl` are dropped. The mapping (`mapTrack`, `buildLibrary`) is in `src/data/audioTracks.js` so tests can import it without Firebase.

### Routes

- `/audio`: category grid. Two columns of category images with the name and track count over a dark gradient, as in the app.
- `/audio/:categoryId`: category image, Play all and Shuffle buttons, then the track list (number, title, a "Lyrics" tag when there are lyrics). The current track shows an equaliser and "Now playing" / "Paused".
- `/audio/:categoryId/:trackId`: the player. Shareable. A shared link opens paused with a Play button, because browsers block autoplay.
- `/songs` still redirects to `/audio`.

### Player (app parity)

- Blurred, darkened artwork background; a switch between Image, Lyrics ("No lyrics for this track" when empty, text size from the reader's saved size) and Up next (the category's tracks, current one highlighted; tapping a track plays it).
- In portrait the player fits one screen with no page scroll: the image (or the Lyrics / Up next panel, which scrolls inside itself) takes the height left by the tabs, title, seek bar and controls. The −10 s / +10 s buttons sit between the elapsed and total times. Landscape keeps a normal scrolling page.
- Seek bar with elapsed and total time (m:ss, or h:mm:ss), a time bubble while dragging, and a spoken value for screen readers.
- Controls: Back 10 s, Previous, Play/Pause (a ring turns around the button while loading; it stays tappable), Next, Forward 10 s, then Shuffle and Repeat toggles. Every control has a visible text label. Space plays/pauses and the arrow keys skip 10 s when no field or button has focus.
- Previous restarts the track when more than 3 seconds have played; otherwise it goes to the previous track, wrapping to the last (a random other track with Shuffle on).
- Next: with shuffle on, a random track other than the current one; otherwise the next track. At the end of the list with Repeat off, playback stops.
- Repeat cycles Off → All → One. When a track ends: One replays it, All goes to the next track (wrapping to the first), and Off goes to the next track and stops after the last one, so Play all plays the whole list. The app stops after every track with Repeat off; the website deliberately differs. With Shuffle on, playback continues with random tracks.
- End of the list with Repeat off: the player pauses at 0:00 on the last track and the mini player stays, so the listener can play again. The app hides its player here; the website deliberately keeps it.
- Shuffle and Repeat are saved locally (`audio-settings`) and restored, as in the app's settings box. Play all turns Shuffle off and the Shuffle button turns it on.
- Error state: "Couldn't play this track. Check your internet and try again." with a large Try again; playback also resumes from the same position when the connection returns. Category and library errors say "Audio needs an internet connection" with Retry, matching the app's online-only message.

Website conventions apply over the app's styling: text labels on controls (not icons alone), Shuffle/Repeat state shown in words as well as colour, 44 px minimum tap targets (72 px for Play), 16 px minimum body text, no modal dialogs.

### Playback across pages

- One `<audio>` element owned by an `AudioProvider` above the router, so playback continues across route changes. Player state and the 4 Hz time updates are in separate contexts so only the seek bar and mini progress line re-render on every update.
- Mini player on every page except the player: artwork, title, category, Play/Pause and Close (stops playback and clears the queue). Tapping it opens the player. Pages gain bottom padding while it is visible, including the safe area; the book/lyrics reader's bottom bar and toast also move above it.
- Leaving the player keeps audio playing with no dialog, following the app plan's rule (the app's "Keep playing / Stop & leave" dialog is not carried over).
- Media Session metadata (title, category as artist, artwork) and play, pause, previous, next, seek, and 10 s back/forward handlers, matching the app's lock-screen notification.
- Playback starts inside the tap handler on the track list (and Play all / Shuffle), then the page navigates, so iPhone Safari treats it as user-initiated. While the player page is open, the address follows the track when it changes by itself.

### Motion

CSS only, no new packages. Motion tokens (`--ease-out`, `--ease-spring`, `--t-fast/med/slow`) are in `src/index.css`; only transform and opacity are animated. Shared artwork morphs use View Transitions (`unstable_viewTransition`) from category tile to category page and from mini player to player, and fall back to a normal page change where unsupported (going back is a normal navigation). Also: the mini player slides up and down, artwork grows when playing and shrinks when paused, art and title slide in on track change, the blurred background crossfades, a sliding pill under the Image / Lyrics / Up next switch, equaliser bars, tiles and rows fading up once, and arrow icons that turn when pressed. Reduced-motion settings shorten animations globally and skip the view transitions.

### Not in the app, so out of scope

- Remembering the last track and position with a Continue option.
- Sleep timer, share button, downloads or offline audio. The app is online-only too.

### Acceptance checks

- Unit tests (`test/audioQueue.test.js`, `test/audioData.test.js`) for next/previous/shuffle/repeat transitions, including the 3-second restart, end-of-list stop and single-track lists, seek clamping, time text, the empty-title track and dropped tracks without audio.
- Browser checks at seven widths: categories, track list, player, lyrics, up next, mini player across routes, shared player link, empty title, missing lyrics, offline error and Retry, reduced motion, keyboard-only use.
- Real iPhone Safari (browser and home-screen app) and Android Chrome: background playback, auto-advance with the screen locked, lock-screen controls including 10 s skip, haptics on Android.

## Changes after Phase 4

- Home tiles are ordered Books, Astottara, Audio, Lyrics, Events, Contact.
- The Today card shows the Panchanga and the programme side by side. The Panchanga column lists, in Kannada and without headings, Samvatsara, Ayana, Ritu, Masa, Paksha, Tithi with its end time, and Vaara (sunrise values, from the compact summary, with a test that they match the detail page). Rahu Kaala is no longer on Home.
- The programme column shows a one-off programme that is running now ("Happening now", with its end), otherwise today's or the next programme. Weekly programmes have no times and are never "happening now".
- Calendar links to the full Panchang for the selected day and city.
- Event details no longer show the interest count.
- Contact: Call, WhatsApp and Directions (Gurunivasa in Google Maps) are one row of icon buttons under "Tap to contact".
- Audio player: fits one portrait screen with no page scroll; the tab is "Image"; Repeat Off plays through the list and stops after the last track.

- Location is not detected; the Panchang city defaults to Mysore and is chosen from the city list.
- PDF books open inside the site (pdf.js 6.3.289, loaded only for PDF books): one slim row for page and zoom, saved page, pages drawn only near the one being read, no download or print button, right-click/long-press saving blocked and printing blank. The files stay public, so this deters casual saving rather than preventing it. Firebase Storage has a read-only CORS rule (GET/HEAD) so the site can fetch them. The unused copies in `public/assets/raw/` were removed.

All of the above was tested by the owner in the browser and works. Build, lint and 67 JavaScript tests pass.

## Phase 5: Polish and release

- Accessibility review, keyboard/focus behavior, contrast and comfortable tap targets.
- Responsive layouts, loading/error recovery, image and bundle performance.
- Metadata, installability and real-device QA for iPhone Safari and home-screen use.
- Production hosting/deployment checks, including shared links and page refreshes.

Notifications and donations remain deferred until separately requested.
