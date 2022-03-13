import Joi from "joi";
import { getSession } from "next-auth/react"
import corsMiddleware, { cors } from "../../middleware/cors";
import connectDB from "../../middleware/mongodb";
import tweetModel from "../../model/tweet";



const sanitizationSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required()
})


const fetchSavedTweets = async (req, res) => {
    await corsMiddleware(req, res, cors);


    if (req.method === "GET") {
        const session = await getSession({ req });


        try {
            if (session) {
                await sanitizationSchema.validateAsync({ email: session.user.email });
                const data = await tweetModel.find({ email: session.user.email }, 'tweetId tweetuserName').sort({ '_id': -1 });

                res.status(200).json({ status: "ok", data, message: "tweets retrived successfully" })

            }
            else {
                res.status(401).json({ status: "error", message: "Bad Request! You are not authenticated" })
            }

        } catch (error) {
            res.status(400).json({ status: "error", message: "Schema validation error" })
        }

    }
    else {
        res.status(405).json({ status: "error", message: "Method not allowed" })
    }
}

export default connectDB(fetchSavedTweets);