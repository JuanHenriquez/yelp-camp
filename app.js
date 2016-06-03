(function() {
    'use strict';
    // Requier all the dependences.
    var express               = require('express'),
        bodyParser            = require('body-parser'),
        mongoose              = require('mongoose'),
        passport              = require('passport'),
        seedDB                = require('./seeds'),
        LocalStrategy         = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        methodOverride        = require('method-override'),
        commentRoutes         = require('./routes/comments'),
        campgroundsRoutes     = require('./routes/campgrounds'),
        mainRoutes = require('./routes/index');

    // Connect to the mongodb database.
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/yelp_camp');

    // Set the app
    var app = express();

    // Create fake data to display.
    // seedDB();

    // Require Models.
    var Campground = require('./models/campground'),
        Comment    = require('./models/comment'),
        User       = require('./models/user');

    // Serve the assets like css, js and fonts files.
    app.use(express.static(__dirname + '/public'));

    // Configure the app:
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));

    // Setup method override package.
    app.use(methodOverride( "_method" ));

    // =====================
    // Passport Setup ======
    // =====================
    app.use(require('express-session')({
        secret: "The world is yours",
        resave: false,
        saveOnInitialized: false
    }));
    app.use(passport.initialize());
    app.use( passport.session() );
    passport.use( new LocalStrategy(User.authenticate()));
    passport.serializeUser( User.serializeUser() );
    passport.deserializeUser( User.deserializeUser() );

    // Middleware to pass users in every template.
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });

    app.use('/', mainRoutes);
    app.use('/campgrounds', campgroundsRoutes);
    app.use('/campgrounds/:id/comments', commentRoutes);

    // Request Listener.
    app.listen(process.env.PORT || 3000, process.env.IP, function() {
        console.log('The YelpCamp server has started');
    });

})();
