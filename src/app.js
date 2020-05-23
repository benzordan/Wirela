// Added for better support of promises
// import  'core-js/stable';
// import  'regenerator-runtime/runtime';
/**
 * 'require' is similar to import used in Java and Python. 
 * It brings in the libraries required to be used
 * in this JS file.
**/
import   Express                     from 'express'
import   ExpressSession              from 'express-session'
import   ExpressHandlebars           from 'express-handlebars'
import   Handlebars                  from 'handlebars'
import   MethodOverride              from 'method-override'
import   CookieParser                from 'cookie-parser'
import   BodyParser                  from 'body-parser'
import   FlashConnect                from 'connect-flash'
import   FlashMessenger              from 'flash-messenger'
import   Passport                    from 'passport'
import   { initialize_passport }               from './config/passport'
import   { SessionStore, initialize_database } from './config/database'
import   { allowInsecurePrototypeAccess }      from '@handlebars/allow-prototype-access'
import   { listRoutes }                        from './utils/routes'
import   { format_date }                       from './helpers/format-date'
import   { multi_check }                       from './helpers/selection'
import   { logic_helpers }                     from './helpers/compare'
import passport from 'passport'
/**
 * Creates an Express server - Express is a web application framework for creating web applications
 * in Node JS.
**/
/** @type {Express.Express} */
const app = Express();
// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', ExpressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	helpers   : Object.assign({
		"format_date": format_date,
		"multi_check": multi_check
	}, logic_helpers()),
	defaultLayout: 'main'  // Specify default template views/layout/main.handlebar 
}));

app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(BodyParser.urlencoded({
	extended: false
}));

app.use(BodyParser.json());
// Creates static folder for publicly accessible HTML, CSS and Javascript files
// app.use(express.static(Path.join(__dirname, '../public')));
app.use(Express.static("./public"));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(MethodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(CookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(ExpressSession({
	key              : 'vidjot_session',
	secret           : 'tojiv',
	resave           : false,
	saveUninitialized: false,
	store            : SessionStore
}));

// This is usually where you add extra middleware
app.use(FlashConnect());
app.use(FlashMessenger.middleware);

//	Initialize database here
initialize_database(false);

app.use(Passport.initialize());
app.use(Passport.session());
//	Setup passport here
initialize_passport(Passport);

//	This must be set up after passport, else it won't have effect
app.use(function (req, res, next) {
	res.locals.alert_success = req.flash('alert_success');
	res.locals.alert_failure = req.flash('alert_failure');
	res.locals.error         = req.flash('error');
	res.locals.user          = req.user || null;
	next();
});
// Use Routes
/*
* Defines that any root URL with '/' that Node JS receives request from, for eg. http:   //localhost:5000/, will be handled by
* mainRoute which was defined earlier to point to routes/main.js
* */
/**
 * Loads routes file main.js in routes directory. The main.js determines which function
 * will be called based on the HTTP request and URL.
**/
app.use('/',       require('./routes/main'));

// Print the routes registered into the application
console.log(`=====Registered Routes=====`);
listRoutes(app._router).forEach(route => {
	console.log(`${route.method.padStart(8)} | /${route.path}`);
});
console.log(`===========================`);

// Starts the server and listen to port 5000
// On production change this to 
// (HTTP)  80 or 8080
// (HTTPS) 43443 
const port = 5000;
app.listen(port, function() {
	console.log(`Server up and listening to port http://localhost:${port}`);
	console.log(`Press CTRL+C to exit`);
});