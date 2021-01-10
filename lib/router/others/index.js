
let others = {};

others.sample = (data, callback) => {
    // Callback a http status code.
    callback(406, {'name':'sample handler'});
}
others.ping = (data, callback) => {
    callback(200);
}
others.notFound = (data, callback) => {
    callback(404);  
}

module.exports = others;