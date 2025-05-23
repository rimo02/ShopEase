const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

module.exports = { connectDatabase }