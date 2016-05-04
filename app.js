// Requier all the dependences.
var express    = require('express'),
    bodyParser = require('body-parser');

// Set the app
var app = express();

// Serve the assets like css, js and fonts files.
app.use(express.static('public'));

// Configure the app:
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// =============
// ROUTES
// =============

var campgrounds = [
    { name: 'Salmo Creek', image: "http://www.photosforclass.com/download/7842069486" },
    { name: 'Granite Hill', image: "http://www.photosforclass.com/download/10131087094" },
    { name: 'Mountain Goat', image: "http://www.photosforclass.com/download/4661960920" }
];

app.get('/', function(rq, res){
    res.render('home');
});

app.get('/campgrounds', function(req, res){

    res.render('campgrounds', { campgrounds: campgrounds });

} );

app.post('/campgrounds', function(req, res){
    // Get the data from the Request Body.
    var name = req.body.name;
    var img = req.body.img;

    // Push new data to the campgrouns array.
    campgrounds.push({ name: name, image: img });
    // Redirect back to the campgrounds page.
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

// Request Listener.
app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp server has started');
});
