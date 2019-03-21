"use strict";
const database = require('../database')
const crypto = require('../crypto')
const logger = require('../logger')

module.exports = async function(req, res) {
    const email = req.body["email"].toLowerCase();
    const password = req.body["password"];

    if (!email || !password) {
        res.status(400).send("Invalid input")
        return;
    }

    const hash = await crypto.hashPassword(password);
    await database.addUser(email, hash);

    const user = await database.getUser(email);
    if (!user) {
        throw `Could not find user we just created with email '${email}'`;
    }

    req.login(user, function(err) {
        if (err) {
            logger.error(`error logging into created user with email '${email}'`, err);
            throw err;
        }

        return res.redirect('/');
    });
}