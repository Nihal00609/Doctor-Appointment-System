const mongoose = require('mongoose')

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected ${mongoose.connect.host}`);
    } catch (error) {
        console.log(`MongoDB server Issue ${error}`);
    }
}

module.exports= connectDB;