import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Astottara() {
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
      <h2 className="text-3xl">Astottara Section</h2>
      <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 my-8">
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "ast1.txt", name: "ಗುರುನಾಥರ ಅಷ್ಟೋತ್ತರ", img: "assets/images/ast1.png" }}><img className="h-96 rounded-2xl" src="assets/images/ast1.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "ast2.txt", name: "ಅರ್ಜುನ ಅವಧೂತರ ಅಷ್ಟೋತ್ತರ", img: "assets/images/ast2.png" }}><img className="h-96 rounded-2xl" src="assets/images/ast2.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "ast3.txt", name: "ಶ್ರೀಧರ ಸ್ವಾಮಿಗಳ ಅಷ್ಟೋತ್ತರ", img: "assets/images/ast3.png" }}><img className="h-96 rounded-2xl" src="assets/images/ast3.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "ast4.txt", name: "ಶ್ರೀ ಶ್ರೀ ಚಂದ್ರಶೇಖರ ಸ್ವಾಮಿಗಳ ಅಷ್ಟೋತ್ತರ", img: "assets/images/ast4.png" }}><img className="h-96 rounded-2xl" src="assets/images/ast4.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "ast5.txt", name: "ದತ್ತಾತ್ರೇಯ ಅಷ್ಟೋತ್ತರ", img: "assets/images/ast5.png" }}><img className="h-96 rounded-2xl" src="assets/images/ast5.png" alt="" /></NavLink>
        <NavLink to={{ pathname: "/contentView" }} state={{ url: "ast6.txt", name: "ಸಾಯಿ ಬಾಬಾ ಅಷ್ಟೋತ್ತರ", img: "assets/images/ast6.png" }}><img className="h-96 rounded-2xl" src="assets/images/ast6.png" alt="" /></NavLink>
      </div>
    </div>
  )
}
