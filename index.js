const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

const app = express();

//cors
app.use(cors());

//body parse
app.use(express.json());

//data base
dbConnection();


//Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))


app.listen(process.env.PORT, () =>{
    console.log('servidor corriendo', process.env.PORT);
})