"use strict";
const bcrypt = require('bcrypt');
const saltRounds = require('./config.json').crypto.saltRounds;

module.exports = class Crypto {
    static hashPassword(password) {
        return bcrypt.hash(password, saltRounds);
    }

    static comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}

