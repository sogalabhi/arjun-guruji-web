import Astottara from "./components/ast";
import Books from "./components/books";
import ContentView from "./components/contentView";
import Home from "./components/home";
import SidebarNav from "./components/sideBar";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Test123 from "./components/test123";
import Lyrics from "./components/lyrics";
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
         element: <><SidebarNav /><Books /></>
      },
      {
         path: "/lyrics",
         element: <><SidebarNav /><Lyrics /></>
      },
      {
         path: "/gallery",
         element: <><SidebarNav /><Books /></>
      },
      {
         path: "/contact",
         element: <><SidebarNav /><Books /></>
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
