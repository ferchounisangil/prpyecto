const mysql = require('mysql');
var connection = null;
var promise = require('promise');
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'seguimiento'
});
/**
 * Función sólo para testear la BD
 */
function databaseConnection() {


    connection.connect((err) => {

        if (err) {
            console.error('error: ' + err.stack)
            return;
        }
        else if (!err) {
            console.log('conexión exitosa' + connection.threadId);
        }
    })

}

function login (){

var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }           
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }

}

/*connection.end((err) => {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
*/


/**
 * Función para insertar puntos en la BD
 * @param  {} lat latitud pasada por url
 * @param  {} long longitu pasada por url
 */
function insertPoints(lat, long,id) {
    console.log("INSERT POINT", lat, long,id)
    let point = `POINT(${lat} ${long})`;
    let query = `INSERT INTO gps(point,vehiculos_idvehiculo) SELECT ST_GeomFromText('${point}'),idvehiculo FROM vehiculos WHERE headers = '${id}' `;
    console.log(query)
connection.connect(function(err) {
    connection.query(query, (err, result, fields) => {
        if (!err) {
            console.log(`results`);
            console.log(JSON.stringify(result))
            //  emitir un evento de registro
        } else if (err) {
            console.log(`error: ${err}`);
        }
    });
});
}

/**
 * Función para consultar a la BD
 */
function getPoints() {
    // consulta de la db para traerse como objeto legible los puntos 
    let query = `SELECT id, ST_AsText(point) AS POINT,  ST_X(point) AS LATITUD, ST_Y(point) AS LONGITUDE FROM gps;`;

    connection.query(query, (err, result, fields) => {
        if (!err) {
            console.log(`results: ${result}`);
            result.forEach(element => {
                console.log(element);
            });
        } else if (err) {
            console.log(`error: ${err}`);
        }
    })
}


var getVehiculosCordenadas = new Promise(function(resolve, reject) {

let query = `SELECT ve.idVehiculo , ST_X(gp.point) AS LATITUD, ST_Y(gp.point) AS LONGITUDE, ve.nombre, gp.id FROM vehiculos as ve , gps as gp WHERE gp.vehiculos_idvehiculo= ve.idvehiculo AND gp.id = (SELECT MAX(gpso.id) FROM gps as gpso where gpso.vehiculos_idvehiculo = ve.idvehiculo);`;
    
    connection.query(query, (err, result, fields) => {
        if (!err) {
           
           resolve(JSON.parse(JSON.stringify(result)));
           console.log('en la promesa de la database');
        
           
        } else if (err) {
            console.log(`error: ${err}`);
            reject(err);
        }

});
});

/*function getpunto () {
return promise((resolve, reject) => {

    let query = `SELECT ve.idVehiculo , ST_X(gp.point) AS LATITUD, ST_Y(gp.point) AS LONGITUDE, ve.nombre, gp.id FROM vehiculos as ve , gps as gp WHERE gp.vehiculos_idvehiculo= ve.idvehiculo AND gp.id = (SELECT MAX(gpso.id) FROM gps as gpso where gpso.vehiculos_idvehiculo = ve.idvehiculo);`;
     console.log("en getpunto");

connection.connect(function(err) {
    connection.query(query, (err, result, fields) => {
        if (!err) {
            result.forEach(element => {
              console.log("se repite");

            });
            resolve(JSON.parse(JSON.stringify(result)));
            console.log(JSON.stringify(result))
        } else if (err) {
            console.log(`error: ${err}`);
             reject(err);
        }
    });
});

});
}  */




/*let getVehiculosCordenadas =new Promise(function(resolve, reject) {
    // consulta de la db para traerse como objeto legible los puntos 
    connection.connect(function(err) {
  if (err) throw err
  
    let query = `SELECT ve.idVehiculo , ST_X(gp.point) AS LATITUD, ST_Y(gp.point) AS LONGITUDE, ve.nombre, gp.id FROM vehiculos as ve , gps as gp WHERE gp.vehiculos_idvehiculo= ve.idvehiculo AND gp.id = (SELECT MAX(gpso.id) FROM gps as gpso where gpso.vehiculos_idvehiculo = ve.idvehiculo);`;
    console.log('en la promesa de la database');
    connection.query(query, (err, result, fields) => {
        if (!err) {
            
         result.forEach(element => {
              console.log("se repite");

            });
            resolve(JSON.parse(JSON.stringify(result)));
            //console.log("estos son los datos?" + JSON.stringify(result) + "\n");
            
           
        } else if (err) {
            console.log(`error: ${err}`);
            reject(err);
        }
    });
});
});   */


/*var Getnewpoint = new Promise(function(resolve,reject){
//connection.connect(); 
let query = `SELECT ve.idVehiculo , ST_X(gp.point) AS LATITUD, ST_Y(gp.point) AS LONGITUDE, ve.nombre, gp.id FROM vehiculos as ve , gps as gp WHERE gp.vehiculos_idvehiculo= ve.idvehiculo AND gp.id = (SELECT MAX(gpso.id) FROM gps as gpso where gpso.vehiculos_idvehiculo = ve.idvehiculo);`;

connection.query(query, (err, result, fields) => {

        if (!err) {
        
            result.forEach(element => {
               // console.log(element);
                //console.log("estos son los datos?" + JSON.stringify(element));

            });
            resolve(JSON.parse(JSON.stringify(result)));
            console.log("estos son los datos?" + JSON.stringify(result) + "\n");

        } else if (err) {
            console.log(`error: ${err}`);
            reject(`${err}`);
        }
});
  //   connection.end(); 

 });*/

/*function getnewpoint() {
    // consulta de la db para traerse como objeto legible los puntos 
    let query = `SELECT ve.idVehiculo , ST_X(gp.point) AS LATITUD, ST_Y(gp.point) AS LONGITUDE, ve.nombre, gp.id FROM vehiculos as ve , gps as gp WHERE gp.vehiculos_idvehiculo= ve.idvehiculo AND gp.id = (SELECT MAX(gpso.id) FROM gps as gpso where gpso.vehiculos_idvehiculo = ve.idvehiculo);`;
    connection.query(query, (err, result, fields) => {
        if (!err) {
            console.log(`results: ${result}`);
            result.forEach(element => {
                console.log(element);
            });
        } else if (err) {
            console.log(`error: ${err}`);
        }
    })
} */

module.exports = {
    databaseConnection,
    insertPoints,
    getPoints,
    getVehiculosCordenadas

} 
