const express = require('express');
const cors = require('cors');
const healthCheckController = require('./controllers/healthCheckController');
const authController = require('./controllers/authController');
const educationController = require('./controllers/educationController.js')
const companiesController = require('./controllers/companyController.js')
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
app.post('/register',authController.signup)
app.post('/logout',authController.logout)
app.get('/api/users/token', requireAuth , authController.getUserByToken);

//Education API's
app.get('/api/education/:userId', requireAuth, educationController.getEducation);
app.post('/api/education/', requireAuth, educationController.addEducation);
app.delete('/api/education/:id', requireAuth, educationController.deleteEducation);



//Company API's
app.get('/api/companies',companiesController.getAllCompanies);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
