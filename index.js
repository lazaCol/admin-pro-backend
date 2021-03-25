const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

//data base
dbConnection();


//Rutas
app.get('/', (req, res) =>{
    res.json({
        msg: "Hello world"
    })
} );


app.listen(process.env.PORT, () =>{
    console.log('servidor corriendo', process.env.PORT);
})