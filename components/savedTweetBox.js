import { Tweet } from "react-static-tweets";
import { useMutation, useQueryClient } from "react-query";
import { dispatchToast, handleShare, removeToast } from "./tweetBox"
import { useState, useContext } from "react";
import { nanoid } from "nanoid";
import { ToastContext } from "../contexts/ToastContext";


const removeTweets = async (body) => {
    return await fetch("/api/removeTweet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}


export default function SavedTweetBox({ tweetId, tweetuserName }) {

    const [loadingSpin, setLoadingSpin] = useState(null);
    const queryClient = useQueryClient();
    const [, dispatch] = useContext(ToastContext);

    const mutation = useMutation((body) => removeTweets(body), {
        onSuccess(data) {
            setLoadingSpin(null);
            const { status, message } = data;
            if (status === "ok") {
                const id = nanoid(10);
                queryClient.invalidateQueries('savedTweets');
                dispatchToast(id, message, "success", dispatch);
                removeToast(id, dispatch);

            }
            else {
                const id = nanoid(10);
                dispatchToast(id, message, "error", dispatch);
                removeToast(id, dispatch);
            }
        },
        onError(error) {
            const id = nanoid(10);
            setLoadingSpin(null);
            dispatchToast(id, "error occurred try again!", "error", dispatch);
            removeToast(id, dispatch);

        }
    })

    const handleRemove = async (tweetId) => {
        setLoadingSpin(true);
        await mutation.mutate({ tweetId })
    }
    return (
        <div className="rounded-md p-4 border-gray-200 border-1">
            {!loadingSpin ? (
                <button className="flex items-center px-3 py-1 rounded-md border-gray-200 border-1 my-2 hover:bg-red-500 hover:text-white" onClick={() => handleRemove(tweetId)}>
                    <span>Remove</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="230-270px:w-3 230-270px:h-3 h-4 w-4 mx-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            ) : (
                <button className="flex items-center  my-2 px-3 py-1 rounded-md bg-red-500 cursor-not-allowed text-white" disabled>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>removing...</span>
                </button>
            )}
            <Tweet id={tweetId} />
            <button className="py-2 rounded-md bg-amber-300 w-full flex justify-center items-center mt-4" onClick={() => handleShare(tweetId, tweetuserName)}>
                <span className="230-270px:text-xs 271-300px:text-sm 301-330px:text-base 331-360px:text-base text-xl">Share it!</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="230-270px:w-3 230-270px:h-3 271-300px:w-4 271-300px:h-4  301-330px:w-4 301-330px:h-4 w-5 h-5 mx-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
            </button>
        </div>
    )
}