"use strict";
const LocalStrategy = require('passport-local').Strategy;
const database = require('./database');
const crypto = require('./crypto');

module.exports = function(passport) {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(email, password, done) {
            const user = await database.getUserWithPassword(email.toLowerCase());
            if (!user) {
                return done(null, false, { message: 'No user with that email' }); 
            }

            const passwordMatch = await crypto.comparePassword(password, user.password);
            if (passwordMatch) {
                return done(null, { id: user.id, email: user.email });
            }

            return done(null, false, { message: 'Incorrect password' }); 
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function(user, done) {
        done(null, user);
    });
}