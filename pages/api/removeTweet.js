import Joi from "joi";
import { getSession } from "next-auth/react";
import corsMiddleware, { cors } from "../../middleware/cors"
import connectDB from "../../middleware/mongodb";
import tweetModel from "../../model/tweet";


const sanitizationSchema = Joi.object({
    tweetId: Joi.string().min(10).max(25).required().pattern(new RegExp('^[0-9]*$'))
})



const removeTweet = async (req, res) => {
    await corsMiddleware(req, res, cors);
    if (req.method === "POST") {
        try {
            const session = await getSession({ req });
            const { tweetId } = req.body;

            if (session) {
                await sanitizationSchema.validateAsync({ tweetId })
                await tweetModel.findOneAndDelete({ tweetId });

                res.status(200).json({ status: "ok", message: "Removed Successfully!" })
            }
            else {
                res.status(401).json({ status: "error", message: "Bad Request! You are not authenticated" })
            }


        } catch (error) {
            res.status(400).json({ status: "error", message: "Schema validation error or cors error" })

        }

    }
    else {
        res.status(405).json({ status: "error", message: "Method not allowed" })
    }
}

export default connectDB(removeTweet)