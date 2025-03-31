import express from 'express';
import cors from "cors"
import bodyparser from "body-parser"
import dotenv from 'dotenv';
// import { insertData } from './data/importData.js';
import ConnectMongo from "./mongodb/setup.js"
import postRouter from './routes/PostRoutes.js';

const port = 3000;

dotenv.config();
const app = express();

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use("/api/posts", postRouter)

ConnectMongo();



// Start the server
app.listen(port, ()  => {
    console.log(`Server is running on port ${port} `);
})



