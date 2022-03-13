import { useState, useEffect } from "react";





export default function useTweet({ query, fire }) {

    const [token, setToken] = useState(null);
    const [q, setQuery] = useState(query);
    const [count, setCount] = useState(0);
    const [isLoading, setLoading] = useState(null);
    const [isError, setError] = useState(null);
    const [data, setData] = useState([]);
    const [noMore, setNoMore] = useState(false);



    useEffect(() => {

        setLoading(true);
        setError(null);
        setNoMore(false);
        const fetcher = async () => {

            if (token) {
                const response = await fetch(`api/fetchTweets?userQuery=${query}&next_token=${token}`);
                const { data: dataArr, status, next_token } = await response.json();

                setToken(next_token);
                setLoading(false);

                if (!next_token) setNoMore(true);

                if (status === "ok" && q != query && dataArr.length > 0) {
                    setData([...dataArr])
                }
                else if (status === "ok" && q == query && dataArr.length > 0) {
                    setData([...data, ...dataArr]);
                }
                else if (status === "ok" && dataArr.length === 0) {
                    setData([]);
                    setError("Sorry, no result found 🤪");
                }
                else if (status === "error") {
                    setError("Couldn't fetch try again!")
                }
            }
            else if (!token && count === 0) {
                const response = await fetch(`api/fetchTweets?userQuery=${query}`);
                const { data: dataArr, status, next_token } = await response.json();

                setToken(next_token);
                setLoading(false);

                if (!next_token) {
                    setCount(1);
                    setNoMore(true);
                }

                if (status === "ok" && dataArr.length > 0) {
                    setData([...dataArr]);

                }
                else if (status === "ok" && dataArr.length === 0) {
                    setData([]);
                    setError("Sorry, no result found 🤪")
                }
                else {
                    setError("couldn't fetch try again!")
                }
            }
        }

        fetcher();
    }, [fire, query]);

    return { isLoading, isError, data, noMore };

}