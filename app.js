require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

const productRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

app.use(express.json());

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use("/uploads", express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     if(req.method === 'OPTIONS'){
//         req.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET ')
//         return res.status(200).json({});
//     }
// });


// Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

app.use(( req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next ) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

mongoose.connect(process.env.MONGODB_URI);
app.listen(process.env.PORRT || 5000, () =>{
    console.log("server is running on 5000");
});