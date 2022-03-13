import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import SavedTweetBox from "../components/savedTweetBox";
import Link from "next/link";
import Head from "next/head";



export default function SavedTweets() {

    const router = useRouter();
    const { data: session, status } = useSession();


    useEffect(() => {

        if (status === "loading") {
            return <p>Loading....</p>
        }
        if (status === "unauthenticated") {
            router.replace("/");
        }

    }, [status, router])

    const { isLoading, isError, data: result } = useQuery('savedTweets', async () => await fetch("/api/fetchSavedTweets").then(res => res.json()));

    return <div>
        <Head>
            <title>JOBPkdo Saved Tweets</title>
            <meta charSet="UTF-8" />
            <meta name="description" content="JOBPkdo is a platform where you can find intern, freelance projects, developer jobs and much more which comes through twitter. You can share jobs with your friends and save them for later." />
            <meta name="keywords" content="JOBPkdo, twitter jobs, intern, remote jobs, freelance, developer jobs" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        {
            session ? (
                <main className="py-12 px-4 230-270px:text-xs 271-300px:text-sm 301-330px:text-base 331-360px:text-lg sm:text-xl lg:text-2xl">
                    <button>
                        <Link href="/">
                            <a className="flex items-center text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                <span className="px-1 hover:underline">Go back</span>
                            </a>
                        </Link>
                    </button>
                    <p className="text-center py-8">Don't worry you can find your saved tweets anytime here😎</p>
                    {isLoading && <p className="text-center py-8">Loading hold on 😋...</p>}
                    {isError && <p className="text-center py-8">Error occurred try again!😢</p>}
                    {result && result.status === "ok" && result.data.length > 0 && <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                        <Masonry gutter="10px">
                            {
                                result.data.map((ele, index) => (
                                    <SavedTweetBox key={index} tweetId={ele.tweetId} tweetuserName={ele.tweetuserName} />

                                ))
                            }
                        </Masonry>
                    </ResponsiveMasonry>}
                    {result && result.status === "ok" && result.data.length === 0 && <p className="text-center py-8">Sorry, you haven't saved any job yet😢</p>}
                    {result && result.status === "error" && <p className="text-center py-8">Error occurred try again!😢</p>}
                </main>
            ) : (<div className="flex justify-center items-center py-16">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>)
        }
    </div>
}