import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { ReaderSettingsProvider } from "./reader/settings";
import AudioProvider from "./audio/AudioProvider";
import MiniPlayer from "./features/audio/MiniPlayer";
import HomePage from "./features/home/HomePage";
import { PanchangPreferencesProvider } from "./features/panchang/preferences";
import ConsentBanner, { PageViewTracker } from "./analytics/ConsentBanner";

// New screens load on demand so the first page stays small.
const BooksPage = lazy(() => import("./features/books/BooksPage"));
const BookPage = lazy(() => import("./features/books/BookPage"));
const ChapterPage = lazy(() => import("./features/books/ChapterPage"));
const AstottaraListPage = lazy(() => import("./features/astottara/AstottaraPages").then((m) => ({ default: m.AstottaraListPage })));
const AstottaraReaderPage = lazy(() => import("./features/astottara/AstottaraPages").then((m) => ({ default: m.AstottaraReaderPage })));
const LyricsCategoriesPage = lazy(() => import("./features/lyrics/LyricsPages").then((m) => ({ default: m.LyricsCategoriesPage })));
const LyricsCategoryPage = lazy(() => import("./features/lyrics/LyricsPages").then((m) => ({ default: m.LyricsCategoryPage })));
const LyricReaderPage = lazy(() => import("./features/lyrics/LyricsPages").then((m) => ({ default: m.LyricReaderPage })));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage"));
const StatusPage = lazy(() => import("./features/status/StatusPage"));
const ContactPage = lazy(() => import("./features/contact/ContactPage"));
const AudioCategoriesPage = lazy(() => import("./features/audio/AudioCategoriesPage"));
const AudioCategoryPage = lazy(() => import("./features/audio/AudioCategoryPage"));
const AudioPlayerPage = lazy(() => import("./features/audio/AudioPlayerPage"));
const EventsPage = lazy(() => import("./features/events/EventsPage"));
const EventDetailsPage = lazy(() => import("./features/events/EventDetailsPage"));
const CalendarPage = lazy(() => import("./features/events/CalendarPage"));
const PanchangPage = lazy(() => import("./features/panchang/PanchangPage"));
const SearchPage = lazy(() => import("./features/search/SearchPage"));
const PrivacyPage = lazy(() => import("./features/privacy/PrivacyPage"));

function RouteLayout() {
  return <><Outlet /><MiniPlayer /><ConsentBanner /><PageViewTracker /><ScrollRestoration /></>;
}

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/audio", element: <AudioCategoriesPage /> },
  { path: "/audio/:categoryId", element: <AudioCategoryPage /> },
  { path: "/audio/:categoryId/:trackId", element: <AudioPlayerPage /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/events/calendar", element: <CalendarPage /> },
  { path: "/events/:id", element: <EventDetailsPage /> },
  { path: "/panchang", element: <PanchangPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/songs", element: <Navigate to="/audio" replace /> },
  { path: "/gallery", element: <Navigate to="/events" replace /> },

  { path: "/books", element: <BooksPage /> },
  { path: "/books/:bookId", element: <BookPage /> },
  { path: "/books/:bookId/:chapter", element: <ChapterPage /> },
  { path: "/astottara", element: <AstottaraListPage /> },
  { path: "/astottara/:id", element: <AstottaraReaderPage /> },
  { path: "/lyrics", element: <LyricsCategoriesPage /> },
  { path: "/lyrics/:category", element: <LyricsCategoryPage /> },
  { path: "/lyrics/:category/:id", element: <LyricReaderPage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/status", element: <StatusPage /> },
];

const router = createBrowserRouter([{ element: <RouteLayout />, children: routes }]);

export default function App() {
  return (
    <ReaderSettingsProvider>
      <PanchangPreferencesProvider>
      <AudioProvider>
      <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center bg-app-bar text-white" role="status"><p>Loading…</p></div>}>
        <RouterProvider router={router} />
      </Suspense>
      </AudioProvider>
      </PanchangPreferencesProvider>
    </ReaderSettingsProvider>
  );
}
