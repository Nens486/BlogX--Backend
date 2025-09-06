import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import userRoutes from './Routes/user.routes.js';
import blogRoutes from './Routes/blog.routes.js'

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "https://blog-x-eight.vercel.app", // frontend domain
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/blog',blogRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT,() =>{
console.log(`server Running on port ${PORT}`);
});
