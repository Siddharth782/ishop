import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"
import morgan from "morgan";
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'
import path from 'path'

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
// app.use(express.static(path.join(__dirname, '../build')))

// Related to user -> new account creation, logging into your account
app.use('/api/v1/auth', authRoutes);


// Related to category -> creating different categories, placing products in them
app.use('/api/v1/category', categoryRoutes);


// Related to products -> creating different products
app.use('/api/v1/product', productRoutes);

// // API for home page
app.get('/', (req, res) => {
    res.send('<h1>Welcome to iShop. Our own Ecommerce website</h1>');
});

// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../build/index.html'))
// })

// local host port
const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => {
    // console.log(`Running on port ${PORT}`);
})