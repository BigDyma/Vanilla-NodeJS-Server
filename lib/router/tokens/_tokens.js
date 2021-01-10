const _data = require('../../handlers/handleFiles');
const helpers = require('../../helpers');

const _tokens = {};

_tokens.post = (data, callback) => {
    const phoneNumber = helpers.phoneValidator(data.payload.phoneNumber);
    const password = helpers.stringValidator(data.payload.password);

    if (password && phoneNumber) {
        _data.read('users', phoneNumber, (err, userData) =>{
            if (!err && userData){ 
                if (helpers.hash(password) === userData.password){
                    const tokenId = helpers.createRandomString(32);
                    const expires = Date.now() + 1000 * 60 * 60;

                    const tokenObject = {
                            'phone': phoneNumber,
                            'id': tokenId, 
                            'expires': expires
                    }
                    _data.create('tokens', tokenId, tokenObject, (err)=>{
                        if (!err) { 
                            callback(200, tokenObject);
                        } else {
                            callback(500, {"Error": "Could not create the token"});
                        }
                    })
                }
                else 
                    callback(400, {"Error": "Wrong Password or User Name"});
            }
            else callback(400, {"Error": "Wrong username or password"});
        })
    }
    else {
        callback(400, {"Error": "Missing required fields"});    
    }
}

_tokens.get = (data, callback) => {
    const id = helpers.stringValidator(data.query.id);
    if (id){

        _data.read('tokens', id, (err, readData) => {

            if (!err && readData) {

                callback(200, readData)
            }
            else {
                callback(404, {"Error": "No such token!"});
            }
        });
    }
    else { 
        callback(400, {"Error": "Missing Fields", "Fields": "phoneNumber"});
    }
}

_tokens.put = (data, callback) => {
    const id = helpers.stringValidator(data.payload.id);
    const extend = typeof(data.payload.extend) === "boolean" && data.payload.extend;

    if (id && extend) {
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now())
                {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    _data.update("tokens", id, tokenData, (err) => { if (!err) { callback(200)} else callback(500, {'Error': "can't update the token!"})});

                } else {
                    callback(400, {"Error": "The Token already expired and can't be extended"})
                }
            } else { 
                callback(400, {"Error": "No such token!"})
            }
        })
    }
}

_tokens.delete = (data, callback) => {
    const id = helpers.stringValidator(data.query.id);
    if (id){
        _data.delete('tokens', id, (err) => {
            if (!err ) {
                callback(200)
            }
            else {
                callback(500, {"Error": "No such token!"});
            }
        });
    }
    else { 
        callback(400, {"Error": "Missing Fields", "Fields": "id"});
    }
}

_tokens.verifyToken = async (phone, id) => {

    let validToken = false;
    await new Promise((resolve, reject) => { _data.read("tokens", id, (err, tokenData) => {
        if (!err && tokenData) { 
               validToken = tokenData.expires > Date.now() && phone === tokenData.phone;
               resolve()
        }
        else {
            reject();
        }
    })});
    return validToken;
}

module.exports = _tokens;