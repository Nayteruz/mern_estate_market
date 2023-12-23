import dotenv from 'dotenv';
import express from 'express';
import mongoose from "mongoose";
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

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

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Упс ошибка сервера"

	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})