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


// RESTFUL ROUTES.
//  Name    |     Path              | Http Verb |              Purpose                     | Mongoose Method.
//  -------------------------------------------------------------------------------------------------------------------------
//  New     | /campgrounds/new      |    GET    | Show new campground form                 |    N/A
//  Create  | /campgrounds          |    POST   | Create new campground and redirect       |    Campground.create()
//  Show    | /campgrounds/:id      |    GET    | Show info about one specific Camp        |    Campground.findById()
//  Edit    | /campgrounds/:id/edit |    GET    | Show edit campground form                |    Campground.findById()
//  Update  | /campgrounds/:id      |    PUT    | Upadte a particular camp, then redirect  |    Campground.findByIdAndUpdate() 
//  Destroy | /campgrounds/:id      |    DELETE | Destroy a particular camp, then redirect |    Campground.findByIdAndRemove()
// ---------------------------------------------------------------------------------------------------------------------------

// NEW
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// CREATE
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
            console.log('Added new campground: ' + data.name + '\n');
            // Redirect back to the campgrounds page.
            res.redirect('/campgrounds');
        }
    });
});

// SHOW
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

// EDIT
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


// UPDATE
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

// DESTROY
router.delete('/:id', isLoggedIn, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, camp) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Campground: ' + camp.name + ' has been removed.\n');
            res.redirect('/campgrounds');
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