import React from 'react'

import { NavLink } from 'react-router-dom'
export default function Lyrics() {
  const w3_open = () => {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openBtn").style.display = "none";
  }
  return (
    <div className='p-4 sm:ml-64 bg-yellow-500 min-h-screen lg:px-20 text-center'>
      <div className="flex justify-between my-5 lg:hidden">
        <img src="https://sriarjunaavadhoota.org/wp-content/uploads/2023/06/new_logo.png" className="w-20" alt="" />
        <button className="text-5xl lg:hidden" onClick={w3_open}>&#9776;</button>
      </div>
      <h1 className="font-samarkan text-5xl lg:text-7xl ">Arjun Guruji App</h1>
      <h2 className="text-3xl">Lyrics Section</h2>
      <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 my-8">
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "daily", name: "Daily bhajans", img: "assets/images/ast1.png" }}><div className="p-36 rounded-2xl  bg-white " ><p>Daily Bhajans</p></div></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "arati", name: "Arati", img: "assets/images/m2.png" }}><div className="p-36 rounded-2xl bg-white " ><p>Arati</p></div></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "others", name: "Others", img: "assets/images/ast2.png" }}><div className="p-36 rounded-2xl bg-white " ><p>Other Bhajans</p></div></NavLink>
      </div>
    </div>
  )
}
