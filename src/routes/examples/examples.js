import { Router, Request, Response } from 'express'
import { ModelVideo } from '../../models/videos'

import   MySQL    from 'mysql2/promise'
import   {Config} from '../../config/database-config'

/**
 * Configure router parameters
 * @see "http://expressjs.com/en/5x/api.html#express.router"
 */
const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/**
 * Your base routes
 */
router.post('/client-api-request', example_client_api_data);
router.get ('/client-api-request', example_client_api_page);

router.get('/client-table-data-raw', example_client_table_data_raw);
router.get('/client-table-data',     example_client_table_data);
router.get('/client-table',          example_client_table_page);

module.exports = router;

// SERVERLESS ARCH
/**
 * Renders the home page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function example_client_api_page(req, res) {
	res.render('examples/client-api-request', {
		"pageJS": [
			"/js/example.js"
		]
	});
}

/**
 * Renders the about page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function example_client_api_data(req, res) {

	console.log("Body:");
	console.log(req.body);

	res.json({
		"rows": [
			{ "name": "Comrade 0", "age": 10 },
			{ "name": "Comrade 1", "age": 11 },
			{ "name": "Comrade 2", "age": 12 }
		]
	})
}

/**
 * Renders the bootstrap-table example
 * @see "https://examples.bootstrap-table.com/#welcome.html"
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function example_client_table_page(req, res) {

	res.render("examples/client-table", {
		"pageJS" : ["https://unpkg.com/bootstrap-table@1.16.0/dist/bootstrap-table.min.js"],
		"pageCSS": ["https://unpkg.com/bootstrap-table@1.16.0/dist/bootstrap-table.min.css"]
	});
}

/**
 * Provides table data as requested
 * @see "https://examples.bootstrap-table.com/#welcome.html"
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function example_client_table_data(req, res) {

	var sortBy = 'title';
	var order  = 'asc';
	var offset = 0;
	var limit  = 25;
	//	Check for query parameters

	console.log("Incoming Query:");
	console.log(req.query);	//	http://.......?sort=title&order=asc	// GET

	//	Note thet do the same stuff
	// const d = a ? b : c;
	// if (a){ d = b; }
	// else  { d = c; }

	//	Pre condition checks
	try {
		sortBy = (req.query.sort)?   req.query.sort   : sortBy;
		order  = (req.query.order)?  req.query.order  : order;
		offset = (req.query.offset)? parseInt(req.query.offset, 10) : offset;
		limit  = (req.query.limit)?  parseInt(req.query.limit, 10)  : limit;
	
		//	Naturally you will have to add stuff like search=???, if you want to support it
	}
	catch(error) {
		console.error("Malformed Get request:");
		console.error(req.query);
		console.error(error);
		return res.status(400);	//	HTTP BAD REQUEST
	}

	//	Actual Implementation
	try {
		const total     = await ModelVideo.count();
		const listVideo = await ModelVideo.findAll({ 
			offset: offset,
			limit : limit,
			order : [
				[sortBy, order.toUpperCase()]
			]
		}).map( (it) => { 
			console.log(it.uuid);
			return it.toJSON(); 
		});

		
		//listVideo = listVideo.map(it => it.);

		return res.status(200).json({
			"total": total,
			"rows" : listVideo
		});
	}
	catch (error) {
		console.error("Failed to retrieve list of videos");
		console.error(error);
		return res.status(500);
	}
}


/**
 * Provides table data as requested with raw sql.
 * This does exactly the same thing as example_client_table_data
 * @see "https://examples.bootstrap-table.com/#welcome.html"
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
 async function example_client_table_data_raw(req, res) {

	var sortBy = 'title';
	var order  = 'asc';
	var offset = 0;
	var limit  = 25;
	//	Check for query parameters
	try {
		sortBy = (req.query.sort)?   req.query.sort   : sortBy;
		order  = (req.query.order)?  req.query.order  : order;
		offset = (req.query.offset)? parseInt(req.query.offset, 10) : offset;
		limit  = (req.query.limit)?  parseInt(req.query.limit, 10)  : limit;
		
		switch (order.toUpperCase()) {
			case    "ASC" : order = "ASC";  break;
			case    "DESC": order = "DESC"; break;
			default: order        = "ASC"; break;
		}
		//	Naturally you will have to add stuff like search=???, if you want to support it
	}
	catch(error) {
		console.error("Malformed Get request:");
		console.error(req.query);
		console.error(error);
		return res.status(400);
	}

	//	Like your old shelve pattern or sqlite3

	//	OPEN
	const connection = await MySQL.createConnection({
		user    : Config.user,
		password: Config.password,
		database: Config.database,
		port    : Config.port,
		host    : Config.host
	});

	//	READ / WRITE
	/** @type {Array<import('../../models/videos').Video>} */
	var result_list  = [];
	var result_count = [{"total": 0}];
	try {
		result_count = await connection.execute("SELECT COUNT(*) as 'total' FROM videos;");
		result_list  = await connection.execute(`SELECT * FROM videos ORDER BY ? ${order} LIMIT ? OFFSET ?;`, [sortBy, limit, offset]);

		const [list_videos, columns_videos] = result_list;
		const [list_count,  columns_count]  = result_count;

		//	CLOSE
		connection.end();
		
		return res.status(200).json({
			"total": list_count[0]["total"],
			"rows" : list_videos
		});
	}
	catch (error) {
		console.error("Failed to retrieve list of videos");
		console.error(error);
		connection.end();
		return res.status(500);
	}
}