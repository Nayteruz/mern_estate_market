import dotenv from 'dotenv';
import express from 'express';
import mongoose from "mongoose";
import userRouter from './routes/user.route.js'

dotenv.config();

mongoose
	.connect(process.env.API_URL)
	.then(() => {
		console.log('CONNECTED TO DB');
	})
	.catch((err) => {
		console.error(`Connection error ${err}`)
	})


const PORT = 3000;

const app = express();

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})

app.use("/api/user", userRouter);