"use strict";
const winston = require('winston');
const kb300 = 300000;

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({
            name: "file#debug",
            filename: './logs/debug.log',
            maxsize: kb300,
            maxFiles: 3,
            level: 'debug'
        }),
        new winston.transports.File({
            name: "file#error",
            filename: './logs/error.log',
            maxsize: kb300,
            maxFiles: 3,
            level: 'error'
        })
    ]  
}); 

