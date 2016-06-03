var express    = require('express');
var router     = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment    = require('../models/comment');

router.get('/new', isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log('Error: ' + err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

router.post('/', isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log('Error: ' + err);
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    // Add username and id to comment.
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    // Save the comment
                    comment.save();

                    // Add the new comment to the campground comments list.
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
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
