// Added for better support of promises
// import  'core-js/stable';
// import  'regenerator-runtime/runtime';
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

/** @type {Express.Express} */
const app = Express();

app.engine('handlebars', ExpressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	helpers   : Object.assign({
		"format_date": format_date,
		"multi_check": multi_check
	}, logic_helpers()),
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(BodyParser.urlencoded({
	extended: false
}));

app.use(BodyParser.json());

app.use(Express.static("./public"));

app.use(MethodOverride('_method'));

app.use(CookieParser());

app.use(ExpressSession({
	key              : 'user_session',
	secret           : 'resu',
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