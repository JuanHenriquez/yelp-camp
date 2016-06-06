var express  = require('express');
var router   = express.Router();
var multer   = require('multer');
var crypto   = require('crypto');
var mime     = require('mime');
var User     = require('../models/user');
var passport = require('passport');

/*// Config multer for upload pictures.
var uploading = multer({
    limits: { fileSize: 10000000, files: 1},
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/img/user_pictures');
        },
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            });
        }
    })
});*/

router.get('/', function(req, res){
    res.render('home');
});


// Show register template.
router.get('/register', function(req, res) {
    res.render('register');
});

// New - Register a user
router.post('/register', function(req, res, next) {
    var newUser = new User({
        username: req.body.username,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        picture: req.body.picture
    });
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log('Error: ' + err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds');
        });

    });
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    'successRedirect': "/campgrounds",
    'failureRedirect': "/login"
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds  ');
});

module.exports = router;
