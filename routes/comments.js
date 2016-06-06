var express    = require('express');
var router     = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment    = require('../models/comment');
var middleware = require('../middleware')

router.get('/new', middleware.isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log('Error: ' + err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

router.post('/', middleware.isLoggedIn,function(req, res){
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
                    console.log('Comment posted!');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            console.log('Error: ' + err);
            res.redirect('back');
        } else {
            res.render('comments/edit', { comment: comment, campground_id: req.params.id });
        }
    });
});

// UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if (err) {
            console.log('Error: ' + err);
            res.redirect('back');
        } else {
            console.log('Comment Updated.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if (err) {
            console.log('Error: ' + err);
            res.redirect('back');
        } else {
            console.log('Comment Deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;
