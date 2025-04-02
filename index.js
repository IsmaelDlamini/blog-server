import express from 'express';
import cors from "cors"
import bodyparser from "body-parser"
import dotenv from 'dotenv';
import ConnectMongo from "./mongodb/setup.js"
import postRouter from './routes/PostRoutes.js';

const port = 3000;

dotenv.config();
const app = express();
app.use(express.json()); // Add this to parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.use(cors())

app.get('/', (req, res) => {
  res.send('The server is running.');
})

app.use("/api/posts", postRouter)

ConnectMongo();

app.listen(port, ()  => {
    console.log(`Server is running on port ${port} `);
})



