import { getSession } from "next-auth/react"
import corsMiddleware, { cors } from "../../middleware/cors";
import connectDB from "../../middleware/mongodb";
import tweetModel from "../../model/tweet";
import Joi from "joi";


const sanitizationSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    tweetId: Joi.string().min(10).max(25).required().pattern(new RegExp('^[0-9]*$')),
    tweetuserName: Joi.string().min(4).max(15).required().pattern(new RegExp('^[a-zA-Z0-9_]*$'))
})


const saveATweet = async (req, res) => {

    await corsMiddleware(req, res, cors);

    if (req.method === "POST") {
        const { tweetId, tweetuserName } = req.body;
        const session = await getSession({ req });


        try {
            if (session) {
                await sanitizationSchema.validateAsync({ email: session.user.email, tweetId, tweetuserName })
                await tweetModel.create({ email: session.user.email, tweetId, tweetuserName })

                res.status(200).json({ status: "ok", message: "Saved successfully!" })

            }
            else {
                res.status(401).json({ status: "error", message: "Bad Request! You are not authenticated" })
            }

        } catch (error) {
            if (error.code === 11000) {
                res.status(400).json({ status: "error", message: "You have already saved the job!" });

            }
            else {
                res.status(400).json({ status: "error", message: "Schema validation error" })
            }

        }
    }
    else {
        res.status(405).json({ status: "error", message: "Method not allowed" })
    }
}

export default connectDB(saveATweet);