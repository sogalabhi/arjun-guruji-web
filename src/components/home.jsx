import { NavLink } from 'react-router-dom'
export default function Home() {
    const w3_open = () => {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("openBtn").style.display = "none";
    }
    return (
        <>
            <div className="p-4 lg:ml-64 bg-yellow-500 min-h-screen px-20 text-center">
                <div className="flex justify-between my-10 lg:hidden">
                    <img src="https://sriarjunaavadhoota.org/wp-content/uploads/2023/06/new_logo.png" className="w-20" alt="" />
                    <button className="text-5xl lg:hidden" onClick={w3_open}>&#9776;</button>
                </div>
                <h1 className="font-samarkan text-7xl text-center">Arjun Guruji App</h1>
                <h2 className="text-4xl">Popular Books</h2>
                <div className="flex flex-col justify-center items-center lg:flex-row gap-x-20 my-8 gap-y-10">
                    <NavLink to="/books/1.%20gurudaari"><img className="h-96 rounded-2xl" src="assets/images/bookgurudaari.png" alt="" /></NavLink>
                    <NavLink to="/books/DjY2FAA9YkPFRPn6Su0y"><img className="h-96 rounded-2xl" src="assets/images/book_gc_book_new.png" alt="" /></NavLink>
                    <NavLink to="/books/gaanavijayarjuna"><img className="h-96 rounded-2xl" src="assets/images/bookgaanavijayarjuna.png" alt="" /></NavLink>
                    <div className="flex items-center"><NavLink to="/books" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>
                </div>

                <h2 className="text-4xl pt-6">Important Astottaras</h2>
                <div className="flex flex-col justify-center items-center lg:flex-row gap-x-20 my-8 gap-y-10">
                    <NavLink to="/astottara/1"><img className="h-96 rounded-2xl" src="assets/images/ast1.png" alt="" /></NavLink>
                    <NavLink to="/astottara/2"><img className="h-96 rounded-2xl" src="assets/images/ast2.png" alt="" /></NavLink>
                    <NavLink to="/astottara/3"><img className="h-96 rounded-2xl" src="assets/images/ast3.png" alt="" /></NavLink>
                    <div className="flex items-center"><NavLink to="/astottara" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>
                </div>

                <h2 className="text-4xl pt-6">Songs Categories</h2>
                <p className="text-6xl my-5">Coming Soon</p>
                {/* <div className="flex flex-col justify-center items-center lg:flex-row gap-x-20 my-8 whitespace-nowrap overflow-hidden">
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
                <div className="flex items-center"><NavLink to="/songs" className=" bg-white py-2 px-4 rounded-xl">View more</NavLink> </div>
                </div> */}

                <h2 className="text-4xl pt-6">Lyrics Categories</h2>
                <div className="flex flex-col justify-center items-center lg:flex-row gap-x-20 my-8 whitespace-nowrap overflow-hidden h-96">
                    <NavLink to="/lyrics/ನಿತ್ಯ ಭಜನೆಗಳು"><div className="h-96 w-40 flex justify-center items-center rounded-2xl  bg-white " ><p>Daily Bhajans</p></div></NavLink>
                    <NavLink to="/lyrics/ಆರತಿ"><div className="h-96 w-40 flex justify-center items-center rounded-2xl bg-white " ><p>Arati</p></div></NavLink>
                    <NavLink to="/lyrics/ಇತರೆ"><div className="h-96 w-40 flex justify-center items-center rounded-2xl bg-white " ><p>Other Bhajans</p></div></NavLink>
                </div>

                <div className="flex items-center"><NavLink to="/lyrics" className=" bg-white py-2 px-4 rounded-xl flex-1">View more</NavLink> </div>
            </div>
        </>
    )
}
