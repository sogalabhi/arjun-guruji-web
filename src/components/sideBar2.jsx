import { NavLink } from "react-router-dom";

export default function Sidebar2(li) {
    const w3_close = () => {
        document.getElementById("mySidebar").style.display = "none";
    }
    return (
        <>
            <div className="h-[100%] w-64 bg-white fixed z-1 overflow-auto hidden lg:block animate-left m-0" id="mySidebar">
                <button className="text-3xl lg:hidden right-5 mt-5 absolute" onClick={w3_close}>&times;</button>
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                    <ul className="space-y-2 font-medium">
                        {li}
                    </ul>
                </div>
            </div>
        </>
    );
}