const port = 3000 || process.env.PORT;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var router = express.Router();
var path = require('path');
var session = require('express-session');
var mysql = require('mysql');

app.use('/insert', require('./routes/insert'));
var bodyParser = require('body-parser');
var database = require('./controllers/database.js');
//app.use(express.static(path.join(__dirname,'public')));



//////////// Creacion del servidor socket io
var SOCKET_MONITOR_ID=null;
var CLIENTES=[];//{id,socket_id}
var ID=null;
var io = require('socket.io').listen(server);

// Nueva conexiòn
io.on('connection', function (socket) {
	
	var address = socket.handshake.address;
	console.log('New connection from ' + address.address + ':' + address.port);

	socket.on("loginMonitor",function(data,response){
	   if(data.monitor="monitor"){	
		   SOCKET_MONITOR_ID=socket.id;
		   var info={id:socket.id};			   
		   response(info);
	   }	
	});
	socket.on("loginCliente",function(data,response){//data={id}
		var index=buscar(data);
		if(index===-1){//NO ENCONTRADO
			
			CLIENTES.push({id:data.id,socket_id:socket.id});
			var info={estado:1,id:data.id};			   
			response(info);
		}
		else{
			var info={estado:0,id:null};			   
			response(info);
		}
		
	});	
	socket.on("posicionClientes", function(data) //{ID,LAT,LON}
	 {
		console.log(JSON.parse(JSON.stringify(data)));
		//console.log(data);
		if(SOCKET_MONITOR_ID!=null)
			io.sockets.connected[SOCKET_MONITOR_ID].emit('monitorPrincipal',data);
		//io.emit('monitorPrincipal',data);

	});	

	socket.on("posicionVehiculos", function() {
	database.getVehiculosCordenadas.then(function(env) {
		
		 env.forEach(element => {
		 	database.getVehiculosCordenadas
		 	console.log("estoy en la promesa", element.idVehiculo,element.LONGITUDE,element.LATITUD,element.id); 
		 	//console.log(env);
		 	var obj={};
		 	obj.id = element.nombre;
		 	obj.lon= element.LONGITUDE;
		 	obj.lat= element.LATITUD;
		 	if(SOCKET_MONITOR_ID!=null)
			io.sockets.connected[SOCKET_MONITOR_ID].emit('monitorPrincipal',obj);

            });
}, function(reason) {
  console.log(reason); // Error!
});
	});

		
	socket.on("disconnect", function() {
		console.log('Clave Desconectada: '+socket.id);
		var n=CLIENTES.length;
		for(var i=0;i<n;i++){
			if(CLIENTES[i].socket_id==socket.id){
				
				if(SOCKET_MONITOR_ID!=null)
					io.sockets.connected[SOCKET_MONITOR_ID].emit('monitorPrincipalDisconnet',CLIENTES[i]);//EL CLIENTE DEBE SER BORRADO
				
				CLIENTES.splice(i, 1);//eliminamos el usuario				
				break;
			}
		}
	});
});

function buscar(data){
		var index=-1;		
		var n=CLIENTES.length;
		for(var i=0;i<n;i++){
			if(CLIENTES[i].id===data.id){
				index=i;
				break;
			}
		}			
		return index;			
}	


server.listen(port, function () {
	console.log('servidor corriendo en el puerto : ' + port);
})

module.exports = router, app;