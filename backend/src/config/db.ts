// Import the mongoose module
const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const MONGO_URI = "mongodb://localhost:27017/";

// Wait for database to connect, logging an error if there is a problem
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MONGO Connected");
    } catch (error) {
        console.log("Connection failed");
        process.exit(1);
    }
}