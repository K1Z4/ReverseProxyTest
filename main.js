"use strict";

const LocalStrategy = require('passport-local').Strategy;
const config = require('./config.json')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const express = require('express')
const logger = require('./logger')
const app = express()

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

require('./configureAuth.js')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'))
app.set('view engine', 'ejs')

app.use(session({
    store: new SQLiteStore({ db: "sessions.sqlite" }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

app.get('/register', asyncMiddleware(require('./controllers/register.js')))
app.post('/register', asyncMiddleware(require('./controllers/register-POST.js')))

app.get('/login', asyncMiddleware(require('./controllers/login.js')))
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login?failure=true' }), (req, res) => res.redirect("/"))
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/', (req, res) => res.render("index"));

app.all('*', (req, res) => res.status(404).send('404 - Page not found'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 - Internal server error')
});

app.listen(config.port, () => logger.debug('Started'))

function authenticate(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    return next();
}
