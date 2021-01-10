const fs = require('fs');
const path = require('path');
const { parseJsonToObject } = require('../../helpers');

const lib = {};

lib.baseDir = path.join(__dirname, './../.data/');

lib.create = function(dir, file, data, callback) {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor)
        {
            const writeData =  JSON.stringify(data);
            fs.writeFile(fileDescriptor, writeData, (err) => {
                if (!err)
                    fs.close(fileDescriptor, (er) => callback(er || false))
                else
                    callback('error writing to existing file');
            })

        }
        else {
            callback('could not filnd file, callback from data.js');
        }
    })
}

lib.read = function(dir, file, callback){
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err && data){
            callback(false, parseJsonToObject(data));
        } else
            callback(err, data);
    });
}

lib.update = function(dir, file, data, callback) {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor)
        {
            const writeData = JSON.stringify(data);
            
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err)
                   {
                    fs.writeFile(fileDescriptor, writeData, (err) => {
                        if (!err)
                        {
                                fs.close(fileDescriptor, (er) => {
                                    callback(er || false)
                            }); 
                        }
                        else
                            callback('error writing to existing file');
                    })
                   }
                else {
                        callback('truncating file error ');
                }
            })
        }
        else {
            callback('could not filnd file, callback from data.js');
        }
    })
}

lib.delete = function(dir, file, callback) {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => callback(err || false));
}
 
module.exports = lib;