(function(){

	'use strict';

	var Comment    = require('../models/comment');
	var Campground = require('../models/campground');

	var middlewareObj = {};

	middlewareObj.checkCommentOwnership = function( req, res, next ) {
		// if user is authenticated
	    if ( req.isAuthenticated() ) {
	        Comment.findById( req.params.comment_id, function( err, comment ) {
	            if (err) {
	                console.log('Error: ' + err);
	                res.redirect('back');
	            } else {
	                // if the current user is the ownership of the comment.
	                if ( comment.author.id.equals(req.user._id) ) {
	                    next();
	                } else {
	                    console.log(req.user.username + ' you not have permission to do that.\n');
	                    res.redirect('back');
	                }
	            }
	        });
	    } else {
	        console.log('You need to log in\n');
	        res.redirect('back');
	    }
	};

	middlewareObj.checkCampgroundOwnership = function( req, res, next ) {
		// if user is authenticated
	    if ( req.isAuthenticated() ) {
	        Campground.findById( req.params.id, function( err, camp ) {
	            if (err) {
	                console.log('Error: ' + err);
	                res.redirect('back');
	            } else {
	                // if the current user is the ownership of the campground
	                if ( camp.author.id.equals(req.user._id) ) {
	                    next();
	                } else {
	                    console.log(req.user.username + ' you not have permission to do that.\n');
	                    res.redirect('back');
	                }
	            }
	        });
	    } else {
	        console.log('You need to log in\n');
	        res.redirect('back');
	    }
	};

	middlewareObj.isLoggedIn = function(req, res, next) {
	    if (req.isAuthenticated()) {
	        return next();
	    }
	    res.redirect("/login");
	}

	module.exports = middlewareObj;
})();