import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);

        console.log("✅ MongoDB Connected");
        console.log(`Host: ${conn.connection.host}`);
        console.log(`DB Name: ${conn.connection.name}`);

    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error(error.message);
        process.exit(1);
    }
}

export default connectDB;