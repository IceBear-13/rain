import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV === 'dev';
const ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

export const app = express();
app.use(cors({
  credentials: true,
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
