import { useRef } from "react";
import Headline from "../../public/assets/raw/test";

function Test123(){
    const ref = useRef(null)
    const hC = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }
    return (
        <div className="">
            <h1>Scroll</h1>
            <button onClick={hC}>Click here</button>
            <div className="h-[1000px] bg-gray-800"></div>
            <Headline text="Ssdddddddddd" ref={ref}/>
        </div>
    )
}
export default Test123;