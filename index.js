import express from 'express';
import cors from "cors"
import bodyparser from "body-parser"
import dotenv from 'dotenv';
import ConnectMongo from "./mongodb/setup.js"
import postRouter from './routes/PostRoutes.js';
import userRouter from './routes/UserRoutes.js';
import cookieParser from 'cookie-parser';
import likeRouter from './routes/LikeRoutes.js';

const port = 3000;

dotenv.config();
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", process.env.FRONTEND_URL], // Replace with your frontend origin
  credentials: true, // Allow cookies (credentials)
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Parse cookies


app.use(express.json()); // Add this to parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.get('/', (req, res) => {
  res.send('The server is running.');
})

app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)
app.use("/api/likes", likeRouter)

ConnectMongo();

app.listen(port, ()  => {
    console.log(`Server is running on port ${port} `);
})



