import React, { useState, useRef } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import test from '../../public/assets/raw/test';
import Test1 from '../../public/assets/raw/test';
export default function ContentView() {
    const { state } = useLocation();
    const [text, setText] = useState("");
    const [heading, setHeading] = useState("");
    const [li, setLi] = useState([]);

    const ref = useRef(null)

    const ab = [
        "ಶುಕ್ಲಾಂಬರಧರಂ ವಿಷ್ಣುಂ",
        "೧. ನೀ ನಮ್ಮ ಗೆಲುವಾಗಿ ಬಾ",
        "೨. ತೊಡಿಸು ಗುರುವೇ ಅರಿವಿನುಂಗುರಾ",
        "೩. ಗುರುನಾಮ ಸ್ಮರಣೆ",
        "೪. ಶುಭಂಕರಾ ಶುಭಂಕರಾ ",
        "೫. ಅರ್ಜುನ ಸುಪ್ರಭಾತ",
        "೬. ದತ್ತನ ಕಂಡೀರಾ ಶ್ರೀ ಗುರುದತ್ತನ ಕಂಡೀರಾ",
        "೭. ಗುರುವೇ ದೈವ ಜಗಕೆಲ್ಲಾ ಅರ್ಜುನ ಗುರುವೇ ನಮಗೆಲ್ಲಾ",
        "೮. ದಯಾಕರಾ ಗುರು ಅಭಯಂಕರಾ, ಅಭಯಂಕರಾ ಗುರು ವಿಶ್ವೇಶ್ವರಾ",
        "೯. ಜ್ಞಾನ ಸಾಯಿ ಜ್ಞಾನ ಸಾಯಿ ಜ್ಞಾನ ಸಾಯಿ ಶಾಮ್",
        "೧೦. ದಯೆ ತೋರೋ ಗುರು ಅರ್ಜುನ ಪ್ರಭುವೇ",
        "೧೧. ದತ್ತ ಬಂದಾನಮ್ಮ ಅರ್ಜುನ ಬಂದಾನೋ",
        "೧೨. ದತ್ತದೇವ ಶರಣಂ",
        "೧೩. ಆರತಿಯ ಮಾಡೋಣ ನಮ್ಮಯ ಗುರುವರಗೇ",
        "೧೪. ತವಶರಣಮ್",
        "೧೫. ಕಂಡಿರಾ ಕಂಡಿರಾ",
        "೧೬. ದೇವ ದೇವನೇ ಲೋಕಪಾಲನೇ",
        "೧೭. ಧರೆಗೆ ಬಂದ ಅವಧೂತ",
        "೧೮. ಮಂದಸ್ಮಿತ",
        "೧೯. ಪೂಜಿಸಿದೆನೋ ನಮ್ಮ ಸದ್ಗುರುವಿನ ಪಾದವ ಪೂಜಿಸಿದೆನೋ",
        "೨೦. ಭಕ್ತಿರಸವು ಹರಿದಿಹುದು ಗಂಗೆಯಾಗಿ"
    ];

    const gdb = [
        "ಶುಕ್ಲಾಂಬರಧರಂ ವಿಷ್ಣುಂ",
        "ಶ್ರೀ ಶ್ರೀ ಸದ್ಗುರು ಅವಧೂತ ಶ್ರೀ ವೇಂಕಟಾಚಲದೇಶಿಕ ಅಷ್ಟೋತ್ತರ ಶತನಾಮಾವಳಿ",
        "ಶ್ರೀ ಅರ್ಜುನ-ಅವಧೂತ ಗುರುಮಹಾರಾಜಸ್ಯ ಅಷ್ಟೋತ್ತರಶತನಾಮಾವಳಿಃ",
        "ಗುರು ಪಾದುಕಾ ಸ್ತೋತ್ರಂ ",
        "ಗುರ್ವಷ್ಟಕಮ್",
        "ಗುರು ವಂದನಂ/ಗುರು ಸ್ತೋತ್ರಂ",
        "ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತ್ಯಷ್ಟಕಂ",
        "ಶ್ರೀ ಶಂಕರಾಚಾರ್ಯ ಸ್ತವಃ",
        "ಶ್ರೀ ದತ್ತನವರತ್ನಮಾಲಿಕಾ",
        "ದತ್ತ ಮಹಿಮೆ ",
        "ದತ್ತ ಬಂದಾ ನಮ್ಮ ಸ್ವಾಮಿ ಬಂದಾನೋ",
        "ಶ್ರೀಮದನಂತ ಶ್ರೀ ವಿಭೂಷಿತ ಅಪ್ಪಲ ಲಕ್ಷ್ಮೀ ನರಸಿಂಹರಾಜಾ",
        "ಜಯದೇವ ಜಯದೇವ ಜಯಸದ್ಗುರುನಾಥ ಶ್ರೀಸದ್ಗುರುನಾಥ",
        "ಜಯದೇವ ಜಯದೇವ ಜಯ ಶ್ರೀ ಗುರುವರಗೇ",
        "ರಾಮ ಬಂದ ಶ್ಯಾಮ ಬಂದ ಶಿವನೇ ",
        "ಕಾಯೌ ಶ್ರೀ ಗೌರಿ ಕರುಣಾ ಲಹರಿ",
        "ಪಂಕಜಾಸನ ಫಾಲಲೋಚನ ",
        "ಚಂದ್ರಶೇಖರಾಯ ನಮಃ ಓಂ",
        "ಗುರು ಮಹಿಮಾ",
        "ಢಂ ಢಂ ಢಂ ಢಮರು ಭಜೇ",
        "ಜಯದೇವಿ ದುರ್ಗೇ ಗೌರಿಶಂಕರಿ ಪಾರ್ವತಿ",
        "ಸುಮ್ಮನೆ ಬ್ರಹ್ಮನಾಗುವನೇ",
        "ಗುರುವೇ ಗತಿಯೆನ್ನು ಮನವೇ ",
        "ಪೂರ್ಣ ಚಿತ್ ಜ್ಯೋತಿ",
        "ನಿನ್ನಾತ್ಮ ನಿಶ್ಚಲವಿರಲು",
        "ವಿಬುಧಕೀರ್ತಿತಂ",
        "ದಯಾಮಯಾ ",
        "ಗಂಗಜಟಾಧರ ",
        "ಮಂಗಳಂ ಗುರುಶ್ರೀ"
    ]

    const gv = [
        "ಸ್ವಾತ್ಮಾರಾಮಂ ನಿಜಾನಂದಂ",
        "1. ನಮಿಸುವೆ ಗುರುರಾಯ ",
        "2. ಜ್ಞಾನವ ನೀಡಯ್ಯ ಗುರುವೇ",
        "3. ನಾ ತಿಳಿದೆ ನಿನ್ನನ್ನೇ ಗುರುದತ್ತನಾ",
        "4. ಕೃಷ್ಣಾರ್ಜುನ",
        "5. ಎಷ್ಟು ಕಾಲ ಕಾಯಬೇಕಯ್ಯಾ",
        "6. ದೂಡದಿರು ಗುರುವೇ ಭವದೊಳಗೆ",
        "7. ದೈವವಂತೆ ದೇವತೆಯಂತೆ ",
        "8. ಯಾರು ಬಲ್ಲರು ಗುರುವೆ ನಿನ್ನ ಮನವ ",
        "9. ದರ್ಶನವ ನೀಡಯ್ಯ ಗುರುವೇ",
        "10. ಭವರೋಗವೈದ್ಯನೇ",
        "11. ರಕ್ಷೆ ಕಟ್ಟಿದೆನಮ್ಮಾ",
        "12. ಕರವ ಹಿಡಿಯೋ ಗುರುನಾಥ",
        "13. ಎಂದು ಕಾಣುವೆ ನಿನ್ನ ಭವ್ಯವದನ",
        "14. ಕೈ ಹಿಡಿದು ನಡೆಸೆನ್ನನು",
        "15. ಶ್ರೀಗುರುಸುಪ್ರಭಾತ ",
        "16. ಗುರುವೆ ತಾಯಿ ಗುರುವೆ ತಂದೆ ",
        "17. ಬದುಕೇ ಧನ್ಯವಾಯಿತು ",
        "18. ಪೂಜ್ಯ ಗುರುಪಾದ",
        "19. ಅರಿವಿನ ಗುರು ",
        "20. ಸುಮ್ಮನೇ ಸಿಗುವಂತವನೇ ಸದ್ಗುರುವು",
        "21. ಆಗಮಿಸು ಗುರುನಾಥ ",
        "22. ಎಲ್ಲಿ ನಿಲುವೆ ಎಂದು ಬರುವೆ ಗುರುವೆ ",
        "23. ದೇವದೇವನೇ ಭಕ್ತಪಾಲನೇ ",
        "24. ಸಖರಾಯಾಧೀಶ",
        "25. ತೊರೆಯಲಾಗುವುದೇ ಗುರು ನಿನ್ನ ಸೇವೆಯ",
        "26. ಭಜ ಗುರುನಾಥಮ್",
        "27. ವಿಬುಧಕೀರ್ತಿತಮ್",
        "28. ಅರ್ಜುನಂ ಶ್ರೀಧರಮ್",
        "29. ಸಖರಾಯಪಟ್ಟಣದಾ ನಾಥನೇ ",
        "30. ಗುರುನಾಥನೇ ನನ್ನ ಈಶ್ವರ",
        "31. ನಮ್ಮ ಸದ್ಗುರು ಗುರುನಾಥ",
        "32. ನಾವು ನೀವುಸೇರಿ ಗುರುಗಳ ಸೇವೆ ಮಾಡೋಣ್ರಿ ",
        "33. ಗುರುನಾಮವೇ ಪಾವನಮ್",
    ]

    const handleSelect = (e) => {
        if (state.url === "gurudaari") {
            const url = e.currentTarget.id;
            fetch("/assets/raw/" + url)
                .then(r => r.text())
                .then(text => {
                    setText(text)
                });
            setHeading(e.currentTarget.getAttribute("heading"))
        }
        else {
            console.log("s")
            ref.current?.scrollIntoView({ behavior: 'smooth' })
        }

    }

    if (text === "") {
        if (state.url === "gurudaari") {
            setText("Select the chapter from the menu")
            for (let i = 0; i < 37; i++) {
                li.push(<li key={i} className='list-none py-2'>
                    <p onClick={handleSelect} id={`chap${i}.txt`} heading={`Chapter ${i}`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">Chapter {i}</p>
                </li>);
            }
            li.push(<li key="last" className='list-none py-2'>
                <p onClick={handleSelect} id={`chaplast.txt`} heading={`Chapter last`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">Chapter last</p>
            </li>);
        }
        else {
            if (state.url === "Gaanavijayarjuna.txt") {
                for (let i = 0; i < gv.length; i++) {
                    li.push(<li key={i} className='list-none py-2'>
                        <p onClick={() => handleSelect()} id={`chap${i}.txt`} heading={`Chapter ${i}`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">{gv[i]}</p>
                    </li>);
                }
            }
            else if(state.url === "Gurudevo Bhava.txt"){
                for (let i = 0; i < gdb.length; i++) {
                    li.push(<li key={i} className='list-none py-2'>
                        <p onClick={() => handleSelect()} id={`chap${i}.txt`} heading={`Chapter ${i}`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">{gdb[i]}</p>
                    </li>);
                }
            }
            const url = state.url;
            if (url.includes("pdf")) {
                console.log("Pdf")
            }
            else {
                fetch("/assets/raw/" + url)
                    .then(r => r.text())
                    .then(text => {
                        setText(text)
                    });
            }
        }

    }

    return (
        <>
            <div className="flex justify-between md:hidden">
                <NavLink to="/" className="flex items-center p-2 text-gray-900 rounded-lggroup justify-center">
                    <img src="assets/images/bookgurudaari.png" className="w-20" alt="" />
                </NavLink>
                <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>
            </div>
            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="/" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group justify-center">
                                <img src="assets/images/bookgurudaari.png" className="w-20" alt="" />
                            </NavLink>
                        </li>
                        {li}
                    </ul>
                </div>
            </aside>
            <div className='p-4 sm:ml-64 bg-gray-800 min-h-screen px-10 lg:px-20'>

                <h2 className="text-3xl text-white my-5 text-center">{state.name}</h2>\
                <h3 className="text-xl text-white text-center mb-4">{heading}</h3>
                <pre className='whitespace-pre-wrap text-white'>{text}</pre>
            </div>
        </>
    )
}
