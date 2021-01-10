// Dependencies

const http = require('http');
const https = require('https');
const  config = require('./config');
const { readFileSync } = require('fs');
const handleServer = require('./lib/handlers/handleServer');

// The server should respond to all requests with a string
let httpServer = http.createServer((req, res) => handleServer(req, res));

//Start the server and listen at the port 3000
httpServer.listen(config.httpPort, ()=> console.log(`The http server is listening on Port: ${config.httpPort}`));

const httpsServerOptions = {
    'key': readFileSync('./https/key.pem'),
    'cert': readFileSync('./https/cert.pem')
}
// The server should respond to all requests with a string
let httpsServer = https.createServer((req, res) => handleServer(req, res));

//Start the server and listen at the port 3000
httpsServer.listen(config.httpsPort, ()=> console.log(`The https server is listening on Port: ${config.httpsPort}`));
