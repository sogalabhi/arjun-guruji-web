import React, { useState, useRef } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';

import Gdb from './content/gdb';
import Gv from './content/gv';
import Ab from './content/ab';

export default function ContentView() {
    const { state } = useLocation();
    const [text, setText] = useState("");
    const [heading, setHeading] = useState("");
    const [li, setLi] = useState([]);
    var x = window.matchMedia("(max-width: 1023px)")

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
                .then(txt => {
                    setText(txt);
                });
            setHeading(e.currentTarget.getAttribute("heading"))
        }
        if (x.matches) {
            w3_close()
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
                        <HashLink smooth to={`#section${i}`} state={state} onClick={() => handleSelect()} id={`chap${i}.txt`} heading={`Chapter ${i}`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">{gv[i]}</HashLink>
                    </li>);
                }
            }
            else if (state.url === "Gurudevo Bhava.txt") {
                for (let i = 0; i < gdb.length; i++) {
                    li.push(<li key={i} className='list-none py-2'>
                        <HashLink smooth to={`#section${i}`} state={state} onClick={() => handleSelect()} id={`chap${i}.txt`} heading={`Chapter ${i}`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">{gdb[i]}</HashLink>
                    </li>);
                }
            }
            else if (state.url === "Arjunam Bhaje.txt") {
                for (let i = 0; i < ab.length; i++) {
                    li.push(<li key={i} className='list-none py-2'>
                        <HashLink smooth to={`#section${i}`} state={state} onClick={() => handleSelect()} id={`chap${i}.txt`} heading={`Chapter ${i}`} className="whitespace-wrap text-yellow-500 cursor-pointer hover:text-gray-800">{ab[i]}</HashLink>
                    </li>);
                }
            }
            else {
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

    }
    const w3_open = () => {
        document.getElementById("mySidebar").style.display = "block";
    }
    const w3_close = () => {
        document.getElementById("mySidebar").style.display = "none";
    }
    return (
        <>
            <div className="h-[100%] w-64 bg-white fixed z-20 overflow-auto hidden lg:block animate-left m-0" id="mySidebar">
                <div className="flex flex-col items-center justify-center sticky top-0 bg-white" >
                    <button className="text-3xl lg:hidden right-5 mt-5 absolute" onClick={w3_close}>&times;</button>
                    <img src={state.img} className='' alt="" />
                    <p className='py-2 text-center bg-white  text-gray-800'>Index</p>
                </div>

                <div className="h-full px-3 py-4 bg-gray-50">
                    <ul className="space-y-2 font-medium">
                        {li}
                    </ul>
                </div>
            </div>
            <div className="flex justify-between sticky top-0 p-5 lg:hidden bg-white z-10">
                <img src={state.img} className="w-20" alt="" />
                <button className="text-5xl lg:hidden" onClick={w3_open}>&#9776;</button>
            </div>
            <div className='p-4 sm:ml-64 bg-gray-800 min-h-screen px-10 lg:px-20 relative'>
                <h2 className="text-3xl text-white py-5 text-center">{state.name}</h2>
                <h3 className="text-xl text-white text-center mb-4">{heading}</h3>
                <pre className='whitespace-pre-wrap text-white pt-5'>{text}</pre>
                {state.url === "Gurudevo Bhava.txt" ? <Gdb /> : <div />}
                {state.url === "Gaanavijayarjuna.txt" ? <Gv /> : <div />}
                {state.url === "Arjunam Bhaje.txt" ? <Ab /> : <div />}

            </div>
        </>
    )
}
