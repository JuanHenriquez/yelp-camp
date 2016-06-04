var mongoose   = require('mongoose');
var Campground = require('./models/campground');
var Comment    = require('./models/comment');

var data = [
    {
        name: 'Yosemite Camp',
        image: '/img/camp1.jpg',
        description: '<p>Vivamus quis mi. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor.</p><p>In turpis. Fusce fermentum. Phasellus accumsan cursus velit. Sed aliquam ultrices mauris.</p>'
    },
    {
        name: 'Silicon Valley Camp',
        image: '/img/camp3.jpg',
        description: '<p>Vivamus quis mi. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor.</p><p>In turpis. Fusce fermentum. Phasellus accumsan cursus velit. Sed aliquam ultrices mauris.</p>'
    },
    {
        name: 'Portland Camp',
        image: '/img/camp2.jpg',
        description: '<p>Vivamus quis mi. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor.</p><p>In turpis. Fusce fermentum. Phasellus accumsan cursus velit. Sed aliquam ultrices mauris.</p>'
    }
];

function seedDB(){

    // Remove all campgrounds.
    Campground.remove({}, function(err) {
        if(err){
            console.log('Error: ' + err);
        } else {
            console.log('All campgrounds removed!');

            // Add a few campground.
            data.forEach(function(camp){
                Campground.create(camp, function(err, newCamp){
                    if(err){
                        console.log('Error: ' + err);
                    } else {
                        console.log('New camp added!');

                        // Create a comment.
                        Comment.create({
                            text: "This is a very short comment for test purposes.",
                            author: "Sherlock Holmes"
                        }, function(err, comment){
                            if(err){
                                console.log('Error: ' + err);
                            } else {
                                newCamp.comments.push(comment);
                                newCamp.save();
                                console.log('New comment added to ' + newCamp.name + ' camp.');
                            }
                        });
                    }
                });
            });
        }
    })
}

module.exports = seedDB;
