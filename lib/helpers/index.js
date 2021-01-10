
const helpers = {};
const { createHmac } = require('crypto');
const { hashingSecret } = require('../../config');


helpers.getKeyByValue = function(object, value) {
    return Object.keys(object).filter(key => object[key] === value);
}

helpers.hash = (str) => {
    return   typeof(str) == 'string' && str.length > 0 ? createHmac('sha256', hashingSecret).update(str).digest('hex'): false;
}

helpers.parseJsonToObject = (obj) => {
    try {
        return  JSON.parse(obj);
    } catch(e) {
        return {};
    }
}

helpers.stringValidator = (data) => {
 return typeof(data) == 'string' && data.trim().length > 0 ? data.trim(): false;
}

helpers.phoneValidator = (data) => {
    return typeof(data) == 'string' && data.trim().length == 10 ? data.trim(): false;
}

helpers.createRandomString = (length) => { 
    const possibleCharacters = "abcdefghjklmnopqrstuvwxABCDEFGHJKLMNOPQRSTUVWX0123456789";

    let str = '';
    for (let i = 1; i < length; i++) {
        str  += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    } 

    return str;
}
module.exports = helpers;