import React, { forwardRef, useRef } from 'react'

function Headline({ text }, ref) {
    return (
        <>

            <div className="h-[1000px] bg-gray-800"></div><h2 ref={ref}>{text}</h2></>)
}
export default forwardRef(Headline)