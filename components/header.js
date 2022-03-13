import { nanoid } from "nanoid";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";
import { useState, useContext } from "react"
import Logo from "./logo";
import { ToastContext } from "../contexts/ToastContext";
import { dispatchToast, removeToast } from "../components/tweetBox"

export default function Header() {

    const [nav, setNav] = useState("hidden");

    const { data: session, status } = useSession();
    const router = useRouter();
    const [, dispatch] = useContext(ToastContext);

    const showLogin = () => {
        const checkobox = document.getElementById("my-modal");
        checkobox.checked = true;
    }

    const hideLogin = () => {
        const checkobox = document.getElementById("my-modal");
        checkobox.checked = false;
    }

    const handleNav = () => {

        if (nav === "hidden") setNav("block");
        if (nav === "block") setNav("hidden");
    }

    const handleSavedTweetClick = () => {
        if (session) {
            return router.push("/savedtweet")
        }
        const id = nanoid();
        dispatchToast(id, "Sign in required!", "info", dispatch);
        removeToast(id, dispatch);
    }
    return (
        <header className="bg-gray-100 shadow-xl">
            <div className="flex justify-between 230-270px:px-2 271-300px:px-2 301-330px:px-2 331-360px:px-3  px-6 py-4 text-xl ">
                <Logo />
                <div className="flex items-center relative">
                    <button className="230-270px:text-8px 271-300px:text-8px 301-330px:text-8px 230-270px:mx-1 font-medium text-blue-500 px-2 rounded-md hover:bg-gray-200 hover:shadow-inner mx-2" onClick={handleSavedTweetClick}>Saved tweets</button>
                    {status === "loading" && <svg className="animate-spin  h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>}
                    {status === "authenticated" && <button onClick={handleNav} className="rounded-full border-2 border-gray-900 230-270px:w-5 230-270px:h-5 271-300px:w-6 271-300px:h-6 301-330px:w-7 301-330px:h-7  w-8 h-8 sm:w-12 sm:h-12"><img className="rounded-full w-full h-full" src={session.user.image} alt={session.user.name} /></button>}
                    {status === "unauthenticated" && <button onClick={showLogin} className="bg-gray-900 text-white  py-1 rounded-md 230-270px:text-8px 271-300px:text-10px 301-330px:text-10px 331-360px:text-10px 230-270px:px-2 271-300px:px-2 301-330px:px-2 331-360px:px-2 px-4 sm:py-2">Login</button>}
                    {session && <div className={`absolute rounded-md shadow-inner bg-gray-100 -right-4 top-7  z-50 ${nav} p-1 230-270px:text-8px 230-270px:w-36 271-300px:text-10px 271-300px:w-40 301-330px:text-10px 331-360px:text-10px text-10px w-44 sm:text-base sm:w-64 sm:top-11`}>
                        <p className="border-b-1 border-gray-800 py-2 text-center">Hello👋 {session.user.name}</p>
                        <button type="button" className="w-full py-2 text-red-500 font-medium" onClick={() => signOut()}>Logout</button>
                    </div>}
                </div>
                <input type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box px-6 py-6">
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer float-right" viewBox="0 0 20 20" fill="currentColor" onClick={hideLogin}>
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-xl font-extrabold text-center py-4">Welcome to JobPkdo</h3>
                        </div>
                        <div>
                            <p className="pt-16 pb-2">SignIn with</p>
                            <button aria-label="Log in with Google" className="p-2 rounded-md flex justify-center items-center border-gray-800 border-1 space-x-1  w-full mx-auto hover:bg-amber-300" onClick={() => signIn('google')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                                </svg>
                                <span>Google</span>
                            </button>
                        </div>
                        <h3 className="font-bold pt-12 pb-2">Why SignIn?</h3>
                        <p>Once, you sign in you can save your favourite tweets for later😎</p>
                    </div>
                </div>
            </div>
        </header>
    )
}