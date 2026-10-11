import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReaderSettingsProvider } from "./reader/settings";
import Home from "./components/home";
import SidebarNav from "./components/sideBar";
import Contact from "./components/contact";
import Songs from "./components/songs";
import Gallery from "./components/gallery";

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

const router = createBrowserRouter([
  // Old screens, replaced in phase 2.
  { path: "/", element: <><SidebarNav /><Home /></> },
  { path: "/songs", element: <><SidebarNav /><Songs /></> },
  { path: "/gallery", element: <><SidebarNav /><Gallery /></> },
  { path: "/contact", element: <><SidebarNav /><Contact /></> },

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
]);

export default function App() {
  return (
    <ReaderSettingsProvider>
      <Suspense fallback={<div className="min-h-[100dvh] bg-app-bar" />}>
        <RouterProvider router={router} />
      </Suspense>
    </ReaderSettingsProvider>
  );
}
