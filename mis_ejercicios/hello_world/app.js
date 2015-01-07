var http = require('htpp');

var server = http.createServer(function (request, response){
	response.writeHead(200, {'content-Type': 'text/plain'});
	response.end('Hola, mundo');
});

server.listen(8000);

console.log('Servidor corriendo en http://localhost:8000');