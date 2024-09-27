import Astottara from "./components/ast";
import Books from "./components/books";
import ContentView from "./components/contentView";
import Home from "./components/home";
import SidebarNav from "./components/sideBar";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Test123 from "./components/test123";
import Lyrics from "./components/lyrics";
import Contact from "./components/contact";
import Songs from "./components/songs";
import Gallery from "./components/gallery";
export default function App() {
   const router = createBrowserRouter([
      {
         path: "/",
         element: <><SidebarNav /><Home /></>
      },
      {
         path: "/books",
         element: <><SidebarNav /><Books /></>
      },
      {
         path: "/astottara",
         element: <><SidebarNav /><Astottara /></>
      },
      {
         path: "/songs",
         element: <><SidebarNav /><Songs /></>
      },
      {
         path: "/lyrics",
         element: <><SidebarNav /><Lyrics /></>
      },
      {
         path: "/gallery",
         element: <><SidebarNav /><Gallery /></>
      },
      {
         path: "/contact",
         element: <><SidebarNav /><Contact /></>
      },
      {
         path: "/test",
         element: <Test123 />,
      },
      {
         path: "/contentView",
         element: <>
            <ContentView />

         </>
      },
   ])
   return (
      <>
         <RouterProvider router={router} />
      </>
   )
}
