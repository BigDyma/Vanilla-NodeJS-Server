const router = require('../../router/');
const { StringDecoder } = require('string_decoder');
const { parseJsonToObject } = require('../../helpers');
const url = require('url');

const handleServer = (req, res) => {

    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname;
    path = path.replace(/^\/+|\/+$/g, '')

    // Get the query string as an object
    const queryStringObj = parsedUrl.query;

    // Get headers
    const headers = req.headers;

    // Get the HTTP method
    let method = req.method;

    // Get the payloads if any
    let decoder = new StringDecoder('utf-8');

    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        let currentHandler = typeof(router[path]) !== 'undefined' ? router[path]: router.notFound;

        const data = {
            'path': path,
            'query': queryStringObj,
            'method': method.toLowerCase(),
            'headers': headers, 
            'payload': parseJsonToObject(buffer)
        }

        currentHandler(data, (statusCode, payload)=>{
                
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};

            let payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

        })
    })
}

module.exports = handleServer;