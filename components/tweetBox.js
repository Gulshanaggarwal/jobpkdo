import { Tweet } from "react-static-tweets"
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import { useState, useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
import { nanoid } from 'nanoid'



const saveTweet = async (body) => {
    return await fetch("/api/saveATweet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => res.json())

}

export const dispatchToast = (id, text, type, dispatch) => {

    dispatch({
        type: "ADD",
        payload: { id, text, type }
    })

}

export const removeToast = (id, dispatch) => {
    setTimeout(() => {
        dispatch({
            type: "REMOVE",
            payload: { id }
        })
    }, 2000)
}

export const handleShare = async (tweetId, tweetuserName) => {

    const shareData = {
        text: `Hey are you looking for an opportunity then don't forget to check it out 👇\n`,
        url: `https://twitter.com/${tweetuserName}/status/${tweetId}`

    }
    try {
        await navigator.share(shareData);

    } catch (error) {
        alert("couldn't share try again!")

    }

}

export default function TweetBox({ tweetId, tweetuserName }) {

    const { data: session } = useSession();
    const [loadingSpin, setLoadingSpin] = useState(null);
    const [, dispatch] = useContext(ToastContext);
    const mutation = useMutation((body) => saveTweet(body), {
        onSuccess(data) {
            setLoadingSpin(null);
            const { status, message } = data;
            if (status == "ok") {
                const id = nanoid(10);
                dispatchToast(id, message, "success", dispatch);
                removeToast(id, dispatch)

            }
            else {
                const id = nanoid(10);
                if (message === "You have already saved the job!") {
                    dispatchToast(id, message, "info", dispatch)
                    removeToast(id, dispatch)
                }
                else {
                    dispatchToast(id, message, "error", dispatch)
                    removeToast(id, dispatch)
                }
            }

        },
        onError(error) {
            const id = nanoid(10);
            setLoadingSpin(null);
            dispatchToast(id, "error occurred", "error", dispatch)
            removeToast(id, dispatch)

        }
    })


    const handleSaveLater = async () => {
        if (session) {
            setLoadingSpin(true);
            return await mutation.mutate({ tweetId, tweetuserName })
        }
        const id = nanoid(10);
        dispatchToast(id, "Sign in required!", "info", dispatch)
        removeToast(id, dispatch)

    }

    return (
        <div className="rounded-md p-4 border-gray-200 border-1 230-270px:text-xs 271-300px:text-sm 301-330px:text-base">
            {
                !loadingSpin ? (
                    <button className="flex border-1 border-gray-200 rounded-md mb-4 px-2 py-1 items-center hover:bg-gray-200" onClick={() => handleSaveLater(tweetId, tweetuserName)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="230-270px:w-3 230-270px:h-3 271-300px:w-4 271-300px:h-4 301-330px:w-4 301-330px:h-4 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <p className="px-1">Save for later</p>
                    </button>
                ) : (
                    <button className="flex items-center border-gray-200 border-1 my-2 px-3 py-1 rounded-md bg-green-500 cursor-not-allowed" disabled>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white">Saving...</span>
                    </button>
                )
            }
            <Tweet id={tweetId} />
            <button className="py-2 rounded-md bg-amber-300 w-full flex justify-center items-center mt-4" onClick={handleShare}>
                <span className="230-270px:text-xs 271-300px:text-sm 301-330px:text-base 331-360px:text-base text-xl">Share it!</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="230-270px:w-3 230-270px:h-3 271-300px:w-4 271-300px:h-4  301-330px:w-4 301-330px:h-4 w-5 h-5 mx-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
            </button>
        </div>
    )
}