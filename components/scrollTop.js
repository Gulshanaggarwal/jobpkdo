import { useState, useEffect } from "react";

export default function ScrollToTop() {

    const [visible, setVisible] = useState("hidden");

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible("block")
        }
        else if (scrolled <= 300) {
            setVisible("hidden")
        }
    };

    const handleScroll = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'

        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
    })


    return (
        <div className={`fixed bottom-4 right-3 bg-gray-900 shadow-inner rounded-full p-3 cursor-pointer ${visible}`} onClick={handleScroll}>
            <svg xmlns="http://www.w3.org/2000/svg" className="230-270px:w-4 230-270px:h-4 271-300px:w-5 271-300px:h-5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        </div>
    )

}