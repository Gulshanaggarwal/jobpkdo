import corsMiddleware, { cors } from "../../middleware/cors";



const fetchTweets = async (req, res) => {
    await corsMiddleware(req, res, cors);

    if (req.method === "GET") {
        let { userQuery } = req.query;
        userQuery = userQuery ? userQuery : "full-stack";
        const l = Object.keys(req.query).length;
        const next_token = l > 1 ? req.query.next_token : null;


        const TweetQuery = `"${userQuery}" (jobs OR intern OR internship OR part-time OR full-time OR ("we are looking for") OR ("we are hiring") OR hiring OR ("remote jobs")) lang:en -is:reply`

        const url = next_token ? `https://api.twitter.com/2/tweets/search/recent?query=${TweetQuery}&expansions=author_id&next_token=${next_token}` : `https://api.twitter.com/2/tweets/search/recent?query=${TweetQuery}&expansions=author_id`

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: "Bearer " + process.env.BEARER_TOKEN
                }
            })

            const jsonResponse = await response.json();
            const { result_count } = jsonResponse.meta;
            let data = [];
            if (result_count > 0) {
                data = jsonResponse.data.map((ele) => {
                    let userName;
                    jsonResponse.includes.users.forEach((item) => {
                        if (ele.author_id === item.id) {
                            userName = item.username;
                        }

                    })
                    ele['tweetuserName'] = userName;
                    return ele;
                })
            }
            res.status(200).json({ status: "ok", data, next_token: jsonResponse.meta.next_token });

        } catch (error) {

            res.status(404).json({ status: "error", data: [], next_token: null })

        }
    }
    else {
        res.status(405).json({ status: "error", message: "Method not allowed" })
    }

}

export default fetchTweets;