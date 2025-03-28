const express = require('express');
const cors = require('cors');
const healthCheckController = require('./controllers/healthCheckController');
const authController = require('./controllers/authController');
const cookieParser = require('cookie-parser');
const { requireAuth } = require("./authMiddleWare.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(morgan("dev"));
app.use(cookieParser());



//Heallth Check API's
app.get('/ping',healthCheckController.healthCheck);

//Auth API's
app.post('/login',authController.login)
app.post('/logout',authController.logout)
app.get('/api/users/token', requireAuth , authController.getUserByToken);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
