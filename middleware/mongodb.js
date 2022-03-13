import mongoose from "mongoose";

const connectDB = handler => async (req, res) => {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

    return handler(req, res);
}

export default connectDB;