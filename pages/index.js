import SearchBar from "../components/searchBar";
import { useRouter } from "next/router";
import { useState } from "react";
import useTweet from "../hooks/useTweet";
import TweetBox from "../components/tweetBox";
import Masnory, { ResponsiveMasonry } from "react-responsive-masonry";
import Head from "next/head";
import VoiceContextProvider from "../contexts/voiceModalContext";
import VoiceModal from "../components/Modal.js/voiceModal";






export default function Home() {

  const router = useRouter();
  const { q: query } = router.query;
  const [fire, setFire] = useState(0);
  const { isLoading, isError, data, noMore } = useTweet({ query: !query ? "full-stack" : query, fire });







  return (
    <VoiceContextProvider>
      <Head>
        <title>JOBPkdo</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="JOBPkdo is a platform where you can find intern, freelance projects, developer jobs and much more which comes through twitter. You can share jobs with your friends and save them for later." />
        <meta name="keywords" content="JOBPkdo, twitter jobs, intern, remote jobs, freelance, developer jobs" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SearchBar />
      <main className="px-4 pt-12 pb-4">
        {data && data.length > 0 && <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masnory gutter="10px">
            {
              data.map((ele, index) => <TweetBox key={index} tweetId={ele.id} tweetuserName={ele.tweetuserName} />)
            }
          </Masnory>
        </ResponsiveMasonry>}
        {isLoading && <p className="text-xl text-center font-medium py-8">Loading hold on ....</p>}
        {isError && <p className="text-xl text-center font-medium py-8">{isError}</p>}
        {!isLoading && !isError && (!noMore ? <button className="mt-16 w-full columns-1 bg-amber-600 text-white rounded-md py-2" type="button" onClick={() => setFire(fire + 1)}>Load more..</button> : <p className="text-xl text-center font-medium py-8"> Sorry, No more results 🤪</p>)}
      </main>
    </VoiceContextProvider>
  )
}
