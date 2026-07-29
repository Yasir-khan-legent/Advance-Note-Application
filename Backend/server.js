import express from "express";
import dotenv from "dotenv";
import auth from "./src/Routes/Auth.routes.js";
import Notes from "./src/Routes/Notes.routes.js";
import Conection from "./src/Config/Mongodb.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [process.env.FRONTEND_URL];
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


Conection()


app.get("/test", (req, res) => {
  res.json({ message: "Backend OK" });
});


app.use('/auth', auth)
app.use('/notes', Notes)





app.listen(process.env.PORT, () => {
  console.log("Server Is Running 👍");
});
