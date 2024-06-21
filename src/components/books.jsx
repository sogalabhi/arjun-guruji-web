import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Books() {
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
      <h2 className="text-3xl">Books Section</h2>
      <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 my-8">
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "gurudaari", name: "ಗುರುದಾರಿ", img: "assets/images/bookgurudaari.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookgurudaari.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "vv.txt", name: "ವೆಂಕಟಾರ್ಜುನ ವಿಜಯಂ", img: "assets/images/bookvv.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookvv.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "Gaanavijayarjuna.txt", name: "ಗಾನವಿಜಯಾರ್ಜುನ", img: "assets/images/bookgaanavijayarjuna.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookgaanavijayarjuna.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "Gurudevo Bhava.txt", name: "ಗುರುದೇವೋಭವ", img: "assets/images/bookgurudevobhava.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookgurudevobhava.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "Bhakti Kusumanjali.txt", name: "ಭಕ್ತಿ ಕುಸುಮಾಂಜಲಿ", img: "assets/images/bookbhaktikusumanjali.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookbhaktikusumanjali.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "Dinakkondu shloka.txt", name: "ದಿನಕ್ಕೊಂದು ಶ್ಲೋಕ", img: "assets/images/bookdinakkondushloka.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookdinakkondushloka.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "Arjunam Bhaje.txt", name: "ಅರ್ಜುನಂ ಭಜೇ", img: "assets/images/bookarjunambhaje.png" }}><img className="h-96 rounded-2xl" src="assets/images/bookarjunambhaje.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "arjunamruthadhare.pdf", name: "ಅರ್ಜುನಾಮೃತಧಾರೆ", img: "assets/images/bookarjunaamruthadhaare.jpg" }}><img className="h-96 rounded-2xl" src="assets/images/bookarjunaamruthadhaare.jpg" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "avadhutaratna.pdf", name: "ಅವಧೂತ ರತ್ನ", img: "assets/images/bookavadhutaratna.jpg" }}><img className="h-96 rounded-2xl" src="assets/images/bookavadhutaratna.jpg" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "anubhava.pdf", name: "ಅನುಭಾವ", img: "assets/images/bookanubhava.jpg" }}><img className="h-96 rounded-2xl" src="assets/images/bookanubhava.jpg" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "gurucharitre.pdf", name: "ಗುರು ಚರಿತ್ರೆ", img: "assets/images/bookgc.jpg" }}><img className="h-96 rounded-2xl" src="assets/images/bookgc.jpg" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "gc_eng.pdf", name: "Guru Charitre", img: "assets/images/bookgc.jpg" }}><img className="h-96 rounded-2xl" src="assets/images/bookgc.jpg" alt="" /></NavLink>
      </div>
    </div>
  )
}