var express = require('express');
var router = express.Router();
const database = require('../controllers/database');

router.use('/', (req, res) => {

    let id = req.headers["user-agent"];
    let {lon, lat} = req.query;
    //console.log(`latitud: ${lat} longitud: ${lon} identificador: ${id}`);
    if(lat!=undefined && lon!=undefined)
    {
    console.log(`latitud: ${lat} longitud: ${lon} identificador: ${id}`);
    database.insertPoints(lat, lon, id);
    console.log("ingresado");
    console.log(`identificador: ${id}`);
    
    }
    else
    {
        console.log(`Error de coordenada`);        
    }
})

module.exports = router;