// Requier all the dependences.
var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

// Set the app
var app = express();

// Serve the assets like css, js and fonts files.
app.use(express.static('public'));

// Configure the app:
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// ===============
// DB Setup ======
// ===============

// Connect to the mongodb database.
mongoose.connect('mongodb://localhost/yelp_camp');

// SCHEMA SETUP:
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Create a new campground and add to DB.
// Campground.create(
//     {
//         name: 'Granite Hill',
//         image: "http://www.photosforclass.com/download/10131087094"
//     }, function(err, camp) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('NEW Campground added!');
//             console.log(camp);
//         }
//     }
// );

// =============
// ROUTES ======
// =============

app.get('/', function(rq, res){
    res.render('home');
});

app.get('/campgrounds', function(req, res){
    // get all campgrounds from DB.
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            // If no errors occurs then render the campgrounds
            // templae with the data retrive from DB.
            res.render('campgrounds', { campgrounds: campgrounds });
        }
    });
} );

app.post('/campgrounds', function(req, res){
    // Get the data from the Request Body.
    var name = req.body.name;
    var img = req.body.img;
    var data = { name: name, image: img };

    Campground.create( data, function(err, data){
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            console.log('Added new campground: ' + data.name);
            // Redirect back to the campgrounds page.
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

// Request Listener.
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp server has started');
});
