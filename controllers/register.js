"use strict";

module.exports = async function(req, res) {
    if (req.isAuthenticated()) return res.redirect('/');
    
    res.render('register');
}