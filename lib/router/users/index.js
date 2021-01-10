
const _users = require('./_users');

const users = (data, callback) => {
    let acceptableMethods = ['post', 'put', 'get', 'delete'];
    if (acceptableMethods.includes(data.method))
        _users[data.method](data, callback);
    else 
        callback(405);
}

module.exports = users;