// Requier all the dependences.
var express               = require('express'),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    seedDB                = require('./seeds'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

// ===============
// DB Setup ======
// ===============

// Connect to the mongodb database.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/yelp_camp');

// ===============
// App Setup ======
// ===============

// Set the app
var app = express();

// Create fake data to display.
seedDB();

// Require Models.
var Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    User       = require('./models/user');

// Serve the assets like css, js and fonts files.
app.use(express.static(__dirname + '/public'));

// Configure the app:
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// =====================
// Passport Setup ======
// =====================
app.use(require('express-session')({
    secret: "The world is yours",
    resave: false,
    saveOnInitialized: false
}));
app.use( passport.initilized() );
app.use( passport.session() );
passport.use( new LocalStrategy(User.authenticated));
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );


// =============
// ROUTES ======
// =============

app.get('/', function(req, res){
    res.render('home');
});

// Index - Show all the campgrounds.
app.get('/campgrounds', function(req, res){
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
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

// CREATE - Add a new camp to the DB.
app.post('/campgrounds', function(req, res){
    // Get the data from the Request Body.
    var name = req.body.name;
    var img  = req.body.img;
    var desc = req.body.desc;
    var data = { name: name, image: img, description: desc };

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

// SHOW - show info about one camp.
app.get('/campgrounds/:id', function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate('comments').exec(function(err, data){
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            res.render('campgrounds/show', { camp: data });
        }
    });
});

// =====================
// Comments Routes
// =====================

app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log('Error: ' + err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log('Error: ' + err);
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// Request Listener.
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp server has started');
});
