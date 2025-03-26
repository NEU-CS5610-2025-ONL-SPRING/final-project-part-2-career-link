const express = require('express');
const cors = require('cors');
const healthCheckController = require('./controllers/healthCheckController');

const app = express();
app.use(cors());
app.use(express.json());

//Heallth Check API's
app.get('/ping',healthCheckController.healthCheck);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
