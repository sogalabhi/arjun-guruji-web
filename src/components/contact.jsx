import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Contact() {
  const w3_open = () => {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openBtn").style.display = "none";
  }
  const contact = () => {
    if (document.getElementById("contact").style.display == "flex") {
      document.getElementById("contact").style.display = "none"
    }
    else {
      document.getElementById("contact").style.display = "flex";
    }
  }

  return (
    <div className='p-4 sm:ml-64 bg-yellow-500 min-h-screen lg:px-20 text-center'>
      <div className="flex justify-between my-5 lg:hidden">
        <img src="https://sriarjunaavadhoota.org/wp-content/uploads/2023/06/new_logo.png" className="w-20" alt="" />
        <button className="text-5xl lg:hidden" onClick={w3_open}>&#9776;</button>
      </div>
      <h1 className="font-samarkan text-5xl lg:text-7xl ">Arjun Guruji App</h1>
      <h2 className="text-3xl">Contact Section</h2>
      {/* <div id="contact" className="flex-col w-[50%] h-96 bg-white mx-auto rounded hidden absolute">
        <img src="https://sriarjunaavadhoota.org/wp-content/uploads/2023/06/new_logo.png" className="w-20 mx-auto my-10" alt="" />
        <a href='https://g.co/kgs/8h1udSY'>#36, Geetaniketna, Sonar Street, Subbarayanakere, Chamraja mohalla, Mysuru, Karnataka 570004</a>
        <a href='tel:+919141075552'>Phone: +91 9141075552</a>
      </div> */}
      <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 my-8">
        <a href='https://sriarjunaavadhoota.org/' target='_blank'><div className="p-36 rounded-2xl bg-white" ><p>Website</p></div></a>
        <a href='https://www.facebook.com/profile.php?id=61554090696815' target='_blank'><div className="p-36 rounded-2xl bg-white" ><p>Facebook</p></div></a>
        <a href='https://www.instagram.com/srisriarjunavadhoothamaharaj/' target='_blank'><div className="p-36 rounded-2xl bg-white" ><p>Instagram</p></div></a>
        <a href='https://www.youtube.com/@srisriarjunavadhoothamaharaj/' target='_blank'><div className="p-36 rounded-2xl bg-white" ><p>Youtube</p></div></a>
        {/* <button onClick={contact} className="p-36 rounded-2xl bg-white cursor-pointer"><p>Contact</p></button>
        <button className="p-36 rounded-2xl bg-white cursor-pointer"><p>Ashrama Details</p></button> */}
        <div id="contact" className="flex-col p-10 bg-white mx-auto rounded-2xl">
          <img src="https://sriarjunaavadhoota.org/wp-content/uploads/2023/06/new_logo.png" className="w-20 mx-auto mb-5" alt="" />
          <a href='https://g.co/kgs/8h1udSY'>#36, Geetaniketna, Sonar Street, Subbarayanakere, Chamraja mohalla, Mysuru, Karnataka 570004</a><br></br>
          <a href='tel:+919141075552'>Phone: +91 9141075552</a>
          <p className='text-2xl my-10'>Ashrama details</p>
          <a href='https://maps.app.goo.gl/aAe31aDxY5DNw4Z2A'> ಶ್ರೀ ವೇoಕಟಾರ್ಜುನ ಧ್ಯಾನಮಂದಿರ,
            ಬನ್ನೂರು - ಬಿದರಿಹುಂಡಿ ರಸ್ತೆ
            ಹಾರೋಹಳ್ಳಿ ಗ್ರಾಮ
            ಮೆಲ್ಲಹಳ್ಳಿ ಗ್ರಾಮದ ಹತ್ತಿರ(ಬನ್ನೂರು ರಸ್ತೆ).</a>
          <p>ಸಾರಿಗೆ ಸೌಕರ್ಯ ಮಾಹಿತಿ:
            ಮೈಸೂರು ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ಬನ್ನೂರು ಕಡೆಗೆ  ತೆರಳುವ
            ಬಸ್ ನಂಬರ್  : 308, 328, 405 .
            ಇಳಿಯುವ ಸ್ಥಳ :  ಬಿದರಹುಂಡಿ ಗೇಟ್</p>
        </div>
      </div>
    </div>
  )
}
