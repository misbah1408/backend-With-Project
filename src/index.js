import dotenv from  'dotenv';
import express from  'express';
import connectDB from './db/index.js';

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT  || 5000, () => console.log(`Server started on port ${process.env.PORT}`))
    app.on("error", (error)=>{
        console.log('Error while connecting to the database',error);
        throw error
    }) 
})

.catch((err)=>{
    console.log("MONGO db connection Failed!!!",err);
})












/*
const app = express();
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
        app.on("error", (error)=>{
            console.log('Error while connecting to the database',error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port: ${process.env.PORT}`);
        })
    }catch(error) {
        console.log('Error connecting to MongoDB:', error);
        throw error
    }
})()

*/