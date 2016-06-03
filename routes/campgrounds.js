var express = require('express');
var router  = express.Router();
var Campground = require('../models/campground');

// Show all the campgrounds.
router.get('/', function(req, res){
    // get all campgrounds from DB.
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            // If no errors occurs then render the campgrounds
            // templae with the data retrive from DB.
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    });
} );

// NEW - Display form to make a camp.
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// CREATE - Add a new camp to the DB.
router.post('/', isLoggedIn, function(req, res){
    // Get the data from the Request Body.
    var camp = req.body.camp;
    camp.author = {
        id: req.user._id,
        username: req.user.username
    };
    
    Campground.create( camp, function(err, data){
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            console.log('Added new campground: ' + data.name);
            // Redirect back to the campgrounds page.
            res.redirect('/campgrounds');
        }
    });
});

// SHOW - show info about one camp.
router.get('/:id', function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate('comments').exec(function(err, data){
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            res.render('campgrounds/show', { camp: data });
        }
    });
});

// EDIT - Show edit form to update a campground.
router.get('/:id/edit', isLoggedIn, function(req, res){

    Campground.findById( req.params.id, function(err, camp) {
        if (err) {
            console.log('Error: ' + err);
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', { campground: camp });
        }
    });

});


// UPDATE - Route to update a forrm. 
router.put('/:id', isLoggedIn, function(req, res) {
    Campground.findByIdAndUpdate( req.params.id, req.body.camp, function( err, camp ) {
        if (err) {
            console.log('Error: ' + err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Middleware.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;