const express = require('express');
const config = require("config");
const {initUserAPI} = require("./controller/userController");
const {initOrchestratorAPI} = require("./controller/jobController");
const {initDBConnection} = require("./service/mongooseConfig");
require('dotenv').config();

const {url} = config.get('database');
const app = express();

app.use(express.json());

initDBConnection(url);
initOrchestratorAPI(app);
initUserAPI(app);

app.listen(8081, () => {
    console.log('Server is up');
})





