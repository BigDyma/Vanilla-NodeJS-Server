const _data = require('../../handlers/handleFiles');
const helpers = require('../../helpers');
const _tokens = require('../tokens/_tokens');

const _users = {};

_users.post = (data, callback) => {
    const userObject = {};
    userObject.firstName =  helpers.stringValidator(data.payload.firstName);
    userObject.lastName =  helpers.stringValidator(data.payload.lastName);
    userObject.phoneNumber =  helpers.phoneValidator(data.payload.phoneNumber);
    userObject.password =  helpers.stringValidator(data.payload.password);
    userObject.tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement;

    continueBoolean = userObject.firstName != false && userObject.lastName != false && userObject.phoneNumber != false && userObject.password != false && userObject.tosAgreement;

    if (continueBoolean)
    {
        _data.read('users', userObject.phoneNumber, (err, data)=> {
            if (!err) {
                callback(400, {'Error': 'This phone number is already in use'});
            }
            else {
                userObject.password = helpers.hash(userObject.password);
                if (userObject.password != false)
                {                
                    _data.create('users', userObject.phoneNumber, userObject, (err) => {
                        if (!err){
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not create the user'});
                        }
                    })
                }
                else {
                    callback(500, {'Error': 'Could not hash the user password'});
                }
            }
        })
    }
    else {
        const missingFields = helpers.getKeyByValue(userObject, false);
        callback(400, {'Error': 'Missing required fields', 'Fields': missingFields});
    }
}

_users.get = async (data, callback) => { 
    const phoneNumber = typeof(data.query.phoneNumber) == "string" && data.query.phoneNumber.trim() > 0 ? data.query.phoneNumber.trim(): false;

    if (phoneNumber) {
        const tokenId = helpers.stringValidator(data.headers.token);
        const validToken = await _tokens.verifyToken(phoneNumber, tokenId);
        if (validToken) {
            _data.read('users', phoneNumber, (err, readData) => {
                if (!err && readData) {
                    delete readData.password;
                    callback(200, readData)
                }
                else {
                    callback(404, {"Error": "No such user!"});
                }
            });
        }
        else callback(403, {"Error": "Acces Denied"});
    }
    else 
        callback(400, {"Error": "Missing Fields", "Fields": "phoneNumber"});
    
}
_users.put = async (data, callback) => {
    //required fields
    const phoneNumber = helpers.phoneValidator(data.payload.phoneNumber);

    //Optional fields
    const firstName = helpers.stringValidator(data.payload.firstName);
    const lastName = helpers.stringValidator(data.payload.lastName);
    const password = helpers.stringValidator(data.payload.password);

     if (phoneNumber)
     {
         if (firstName || lastName || password)
         {  
            const tokenId = helpers.stringValidator(data.headers.token);
            if ( await _tokens.verifyToken(phoneNumber, tokenId))
            {
                _data.read('users', phoneNumber, (err, userData)  => {
                    if (!err && userData){
                        if (firstName) userData.firstName = firstName;
                        if (lastName) userData.lastName = lastName;
                        if (password) userData.password = helpers.hash(password);

                        // console.log({userData, phoneNumber});
                        _data.update("users", phoneNumber, userData, (err) => {
                            if (err) {
                                console.log(err);
                                callback(500, {"Error": "Can't update user data"});
                            }
                            else {
                                callback(200)
                            }
                        });
                    }
                    else 
                        callback(400, {"Error": "There is no such phone registered"})
                });
            }
            else callback(403, {"Error": "Acces denied!"});

         }
         else callback(400, {"Error": "No field to update indicated!"});
     }
     else
        callback(400, {"Error": "No required field provided"})
    
}
_users.delete = (data, callback) => {
    const phoneNumber = helpers.phoneValidator(data.query.phoneNumber);
    if (phoneNumber){
        const tokenId = helpers.stringValidator(data.payload.token);
        if (_tokens.verifyToken(phoneNumber, tokenId)){
            _data.delete('users', phoneNumber, (err) => {
                if (!err ) {
                    callback(200)
                }
                else {
                    callback(500, {"Error": "No such user!"});
                }
            });
        }
    }
    else { 
        callback(400, {"Error": "Missing Fields", "Fields": "phoneNumber"});
    }
    
}



module.exports = _users;