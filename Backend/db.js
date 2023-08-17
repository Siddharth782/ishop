import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to DB ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in MongoDB is ${error}`)
    }
};

export default connectDB;