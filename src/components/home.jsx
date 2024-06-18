import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Home() {
    return (
        <>

            <div className="p-4 sm:ml-64 bg-yellow-500 min-h-screen px-20">
                <h1 className="font-samarkan text-7xl text-center">Arjun Guruji App</h1>
                <h2 className="text-4xl">Popular Books</h2>
                <div className="flex flex-col lg:flex-row gap-x-20 my-8 gap-y-10">
                    <NavLink to={{ pathname: "/contentView" }} state={{ url: "gurudaari", name: "ಗುರುದಾರಿ" }}><img className="h-96 rounded-2xl" src="assets/images/bookgurudaari.png" alt="" /></NavLink>
                    <NavLink to={{ pathname: "/contentView" }} state={{ url: "vv.txt", name: "ವೆಂಕಟಾರ್ಜುನ ವಿಜಯಂ" }}><img className="h-96 rounded-2xl" src="assets/images/bookvv.png" alt="" /></NavLink>
                    <NavLink to={{ pathname: "/contentView" }} state={{ url: "Gaanavijayarjuna.txt", name: "ಗಾನವಿಜಯಾರ್ಜುನ" }}><img className="h-96 rounded-2xl" src="assets/images/bookgaanavijayarjuna.png" alt="" /></NavLink>
                </div>
                <div className="flex items-center"><NavLink to="/books" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>

                <h2 className="text-4xl pt-6">Important Astottaras</h2>
                <div className="flex flex-col lg:flex-row gap-x-20 my-8 gap-y-10">
                    <NavLink to={{ pathname: "/contentView" }} state={{ url: "gurudaari", name: "ಗುರುದಾರಿ" }}><img className="h-96 rounded-2xl" src="assets/images/ast1.png" alt="" /></NavLink>
                    <NavLink to={{ pathname: "/contentView" }} state={{ url: "vv.txt", name: "ವೆಂಕಟಾರ್ಜುನ ವಿಜಯಂ" }}><img className="h-96 rounded-2xl" src="assets/images/ast1.png" alt="" /></NavLink>
                    <NavLink to={{ pathname: "/contentView" }} state={{ url: "Gaanavijayarjuna.txt", name: "ಗಾನವಿಜಯಾರ್ಜುನ" }}><img className="h-96 rounded-2xl" src="assets/images/ast3.png" alt="" /></NavLink>
                </div>
                <div className="flex items-center"><NavLink to="/astottara" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>

                <h2 className="text-4xl pt-6">Songs Categories</h2>
                <div className="flex gap-x-20 my-8 whitespace-nowrap overflow-hidden">
                    <div className="relative">
                        <img className="h-96 " src="assets/images/m1.png" alt="" />
                        <h3 className="absolute top-[50%] w-full text-center text-white">Astottara</h3>
                    </div>
                    <div className="relative">
                        <img className="h-96" src="assets/images/m2.png" alt="" />
                        <h3 className="absolute top-[50%] w-full text-center text-white">Arati</h3>
                    </div>
                    <div className="relative">
                        <img className="h-96" src="assets/images/m3.png" alt="" />
                        <h3 className="absolute top-[50%] w-full text-center text-white">Bhaja Gurunatham</h3>
                    </div>
                </div>
                <div className="flex items-center"><NavLink to="/songs" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>

                <h2 className="text-4xl pt-6">Lyrics Categories</h2>
                <div className="flex gap-x-20 my-8">
                    <div className="relative">
                        <img className="h-96 " src="assets/images/m1.png" alt="" />
                        <h3 className="absolute top-[50%] w-full text-center text-white">Daily Bhajans</h3>
                    </div>
                    <div className="relative">
                        <img className="h-96" src="assets/images/m2.png" alt="" />
                        <h3 className="absolute top-[50%] w-full text-center text-white">Arati</h3>
                    </div>
                    <div className="relative">
                        <img className="h-96" src="assets/images/m3.png" alt="" />
                        <h3 className="absolute top-[50%] w-full text-center text-white">Vagdevi Sangeeta</h3>
                    </div>
                </div>
                <div className="flex items-center"><NavLink to="/lyrics" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>
            </div>
        </>
    )
}
