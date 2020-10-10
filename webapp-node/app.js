const de =require('dotenv').config();
const express = require('express');
//const cors = require('cors');
const bodyparser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const app = express();
app.use(bodyparser.json());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
//app.use(cors());
// 3) ROUTES
app.use('/v1/user/', userRouter);
module.exports = app;