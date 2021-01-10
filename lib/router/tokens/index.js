const _tokens = require('./_tokens');

// Tokens
const tokens = (data, callback) => {
    let acceptableMethods = ['post', 'put', 'get', 'delete'];
    if (acceptableMethods.includes(data.method))
        _tokens[data.method](data, callback);
    else 
        callback(405);
}

module.exports = tokens;