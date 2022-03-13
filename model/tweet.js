import mongoose from "mongoose";


const tweetSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    tweetId: {
        required: true,
        unique: true,
        type: String,
    },
    tweetuserName: {
        required: true,
        type: String
    }
})

mongoose.models = {};
const tweetModel = mongoose.model("Tweet", tweetSchema);

export default tweetModel;