import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"
import morgan from "morgan";
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cors from 'cors'

// // configuring env file
dotenv.config();

// // connecting to DB
connectDB();

const app = express();

// middleware - this is used for sending object in request
app.use(express.json());
// middleware
app.use(morgan('dev'))
app.use(cors())

// Related to user -> new account creation, logging into your account
app.use('/api/v1/auth', authRoutes);


// Related to category -> creating different categories, placing products in them
app.use('/api/v1/auth', categoryRoutes);

// // API for home page
app.get('/', (req, res) => {
    res.send('<h1>Welcome to iShop. Our own Ecommerce website</h1>');
});

// local host port
const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})